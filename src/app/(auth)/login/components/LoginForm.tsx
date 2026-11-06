"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { setUser } from "@/store/slices/authSlice";

import { loginSchema, type LoginFormValues } from "../login.schema";
import login, { LoginMethod } from "../actions/login";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import type { SsoProvider } from "../actions/getSsoProviders";
import getSsoProviders from "../actions/getSsoProviders";
import googleLogin from "../actions/googleLogin";

type LoginContext = {
  email: string;
  challenge_id: number;
  expires_in: number;
  mfa_required: true;
  methods: LoginMethod[];
  backup_codes_remaining: number;
  programs: unknown[];
  selected_method?: LoginMethod;
};

const LOGIN_CONTEXT_KEY = "uam_login_context";

function saveLoginContext(context: LoginContext) {
  sessionStorage.setItem(LOGIN_CONTEXT_KEY, JSON.stringify(context));
}

function getVerificationRoute(method: LoginMethod) {
  switch (method) {
    case "otp":
      return "/login-otp";
    case "totp":
      return "/login-totp-verification";
    case "backup":
      return "/backup-codes";
    default:
      return "/login";
  }
}

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [providers, setProviders] = useState<SsoProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    const url = new URL(window.location.href);

    const error = url.searchParams.get("error");

    if (!error) return;

    // Show backend error through toast
    toast.error(error, {
      duration: 5000,
    });

    // Remove error from URL after displaying toast
    url.searchParams.delete("error");

    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, []);

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) return;

    const params = new URLSearchParams(hash.substring(1));

    const email = params.get("email") ?? "";
    const challengeId = Number(params.get("challenge_id"));
    const expiresIn = Number(params.get("expires_in") ?? 300);
    const backupCodesRemaining = Number(
      params.get("backup_codes_remaining") ?? 0,
    );

    const methods = (params.get("methods") ?? "")
      .split(",")
      .filter(
        (method): method is LoginMethod =>
          method === "otp" || method === "totp" || method === "backup",
      );

    const programs = (params.get("programs") ?? "").split(",").filter(Boolean);

    const mfaRequired = params.get("mfa_required") === "true";

    if (
      !email ||
      !Number.isInteger(challengeId) ||
      challengeId <= 0 ||
      !mfaRequired ||
      methods.length === 0
    ) {
      toast.error("Invalid Google authentication response.");
      router.replace("/login");
      return;
    }

    const loginContext: LoginContext = {
      email,
      challenge_id: challengeId,
      expires_in: expiresIn,
      mfa_required: true,
      methods,
      backup_codes_remaining: backupCodesRemaining,
      programs,
    };

    // Save using the same structure as normal login
    saveLoginContext(loginContext);

    console.log("[GOOGLE SSO] Login Context:", loginContext);

    // Remove callback hash from URL
    window.history.replaceState(null, "", window.location.pathname);

    // Multiple methods: let user choose
    if (methods.length > 1) {
      router.replace("/factor-choice");
      return;
    }

    // Single method: save selection in the same object
    const selectedMethod = methods[0];

    saveLoginContext({
      ...loginContext,
      selected_method: selectedMethod,
    });

    router.replace(getVerificationRoute(selectedMethod));
  }, [router]);

  // useEffect(() => {
  //   // Login page open hone par previous incomplete flow clear.
  //   clearAuthFlowSession();
  // }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchProviders() {
      try {
        const result = await getSsoProviders();

        if (!isMounted) return;

        if (result.type === "success") {
          setProviders(result.providers);
        } else {
          toast.error(result.message);
        }
      } catch {
        if (isMounted) {
          toast.error("Unable to load sign-in providers.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingProviders(false);
        }
      }
    }

    fetchProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  async function onSubmit(values: LoginFormValues) {
    try {
      // 1. Call login API
      const result = await login(values);

      if (result.type !== "success") {
        toast.error(result.message);
        return;
      }

      // 2. Normal login without MFA
      if (!result.requiresTwoFactor) {
        if (!result.user) {
          toast.error("User information is missing.");
          return;
        }

        sessionStorage.removeItem(LOGIN_CONTEXT_KEY);

        dispatch(setUser(result.user));

        toast.success(result.message);
        router.replace("/dashboard");
        return;
      }

      // 3. Validate MFA response
      if (
        !Number.isInteger(result.challengeId) ||
        !result.challengeId ||
        !result.methods?.length
      ) {
        toast.error("Invalid authentication challenge.");
        return;
      }

      const methods = result.methods.filter(
        (method): method is LoginMethod =>
          method === "otp" || method === "totp" || method === "backup",
      );

      if (methods.length === 0) {
        toast.error("No supported verification methods are available.");
        return;
      }

      // 4. Create the same context structure as Google SSO
      const loginContext: LoginContext = {
        email: values.email,
        challenge_id: result.challengeId,
        expires_in: result.expiresIn ?? 300,
        mfa_required: true,
        methods,
        backup_codes_remaining: result.backupCodesRemaining ?? 0,
        programs: result.programs ?? [],
      };

      // 5. Save only one session key
      saveLoginContext(loginContext);

      console.log("[AUTH] Login Context:", loginContext);

      toast.success(result.message);

      // 6. Multiple methods: show factor choice
      if (methods.length > 1) {
        router.replace("/factor-choice");
        return;
      }

      // 7. Single method: save selected method in same context
      const selectedMethod = methods[0];

      saveLoginContext({
        ...loginContext,
        selected_method: selectedMethod,
      });

      router.replace(getVerificationRoute(selectedMethod));
    } catch (error) {
      console.error("[AUTH] Login Submission Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      reset();
    }
  }
  function handleSocialLogin(provider: SsoProvider) {
    const providerCode = provider.code.toUpperCase();

    if (providerCode === "GOOGLE") {
      googleLogin();
      return;
    }

    window.location.assign(
      `/api/proxy/auth/sso/${encodeURIComponent(providerCode)}/login`,
    );
  }

  function getProviderIcon(code: string) {
    const icons: Record<string, string> = {
      GOOGLE: "logos:google-icon",
      FACEBOOK: "logos:facebook",
      APPLE: "logos:apple",
      MICROSOFT: "logos:microsoft-icon",
    };

    return icons[code.toUpperCase()] ?? "mdi:login";
  }
  function onInvalid() {
    toast.error("Validation error", {
      description: "Please check the highlighted fields and try again.",
    });
  }

  return (
    <div className="w-full max-w-110 rounded-2xl border border-white/50 bg-white/65 p-7 shadow-(--shadow-modal) backdrop-blur-xl sm:p-9">
      {/* Brand */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <ShieldCheck size={22} />
        </div>

        <div>
          <p className="font-semibold leading-tight text-text-primary">UAM</p>
          <p className="mt-1 text-sm leading-tight text-text-secondary">
            Authentication
          </p>
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-[40px] sm:leading-tight">
        Welcome back!
      </h2>

      <p className="text-base leading-snug text-text-secondary">
        Sign in to your workspace with your email or username.
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="mt-4 space-y-4"
      >
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              id="email"
              name={field.name}
              label="Email or username"
              type="text"
              placeholder="name@university.edu"
              autoComplete="username"
              leftIcon={<Mail size={19} />}
              inputSize="lg"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              id="password"
              name={field.name}
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              leftIcon={<Lock size={19} />}
              inputSize="lg"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Forgot Password */}
        <div className="flex justify-end pt-0.5">
          <a
            href="/forgot-password"
            className="text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Forgot Password?
          </a>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
        >
          Login
        </Button>
      </form>
      {/* SSO Section */}
      {isLoadingProviders ? (
        <div className="mt-5 flex items-center justify-center gap-3 py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />

          <span className="text-sm font-medium text-text-secondary">
            Loading sign-in methods...
          </span>
        </div>
      ) : providers.length > 0 ? (
        <>
          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border-default" />

            <span className="whitespace-nowrap text-xs font-semibold text-text-muted">
              OR CONTINUE WITH
            </span>

            <div className="h-px flex-1 bg-border-default" />
          </div>

          {/* SSO Buttons */}
          <div className="space-y-3">
            {providers.map((provider) => (
              <Button
                key={provider.code}
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                leftIcon={
                  <Icon
                    icon={getProviderIcon(provider.code)}
                    width={23}
                    height={23}
                  />
                }
                onClick={() => handleSocialLogin(provider)}
              >
                Continue with {provider.name}
              </Button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
