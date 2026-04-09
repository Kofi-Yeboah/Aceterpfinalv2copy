import { Eye, EyeOff, UserIcon, Building2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import svgPaths from "../imports/svg-bfl2kj9cou";
const imgImage36 = "/acet-logo.png";
const imgImage68 = "/acet-image.png";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  // Step: 'choose' (card selection) or 'signin' (login form)
  const [step, setStep] = useState<"choose" | "signin">("choose");
  const [userType, setUserType] = useState<"employee" | "guest" | "">("");
  
  // Sign-in state
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = loginMethod === "email" 
    ? email.length > 0 && password.length > 0
    : phoneNumber.length > 0 && password.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onLogin();
    }
  };

  const handleSelectType = (type: "employee" | "guest") => {
    setUserType(type);
    setStep("signin");
  };

  const handleBack = () => {
    setStep("choose");
    setUserType("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div className="bg-slate-100 relative w-full h-screen overflow-hidden">
      {/* Left Side - Background Image */}
      <div className="absolute h-[1024px] left-0 top-1/2 translate-y-[-50%] w-[751px]">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage68} />
      </div>

      {/* Right Side - Form */}
      <div className="absolute bg-white box-border content-stretch flex flex-col gap-[24px] items-center right-[calc((100vw-1176px)/2)] overflow-y-auto overflow-x-clip px-[24px] py-[32px] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(100,116,139,0.05),0px_2px_2px_0px_rgba(100,116,139,0.05),0px_0px_0px_1px_rgba(100,116,139,0.05)] top-1/2 translate-y-[-50%] w-[400px] max-h-[90vh]">
        {/* Logo and Title */}
        <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0">
          <div className="h-[65px] relative shrink-0 w-[187px]">
            <img alt="ACET Logo" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImage36} />
          </div>
          <div className="content-stretch flex flex-col gap-[6px] items-center leading-[24px] relative shrink-0 text-center">
            <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold relative shrink-0 text-[18px] text-slate-900 tracking-[-0.36px] w-[352px]">
              {step === "choose" ? (
                <>
                  <span>Welcome to </span>
                  <span className="text-[#323584]">ACET</span>
                </>
              ) : (
                <>
                  <span>Sign in to </span>
                  <span className="text-[#323584]">ACET</span>
                </>
              )}
            </p>
            <p className="font-['Montserrat:Regular',sans-serif] font-normal relative shrink-0 text-[14px] text-slate-500 tracking-[-0.28px] w-[352px]">
              {step === "choose" ? "Choose your account type to get started" : "Welcome back! Please sign in to continue"}
            </p>
          </div>
        </div>

        {step === "choose" ? (
          <>
            {/* Choose Employee or Guest */}
            <div className="flex flex-col gap-4 w-full">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelectType("employee")}
                  className="group relative flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-white to-slate-50 transition-all duration-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    <UserIcon size={26} className="text-blue-600" />
                  </div>
                  <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[14px] text-slate-800">Employee</p>
                </button>
                <button
                  onClick={() => handleSelectType("guest")}
                  className="group relative flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-white to-slate-50 transition-all duration-200 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-100/50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    <Building2 size={26} className="text-amber-600" />
                  </div>
                  <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[14px] text-slate-800">Guest</p>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 self-start w-full"
            >
              <ArrowLeft size={16} />
              <span className="font-['Montserrat:Regular',sans-serif] text-[13px]">Back</span>
            </button>

            {/* Tab Switcher */}
            <div className="bg-slate-100 relative rounded-[10px] shrink-0 w-full">
              <div className="size-full">
                <div className="box-border content-stretch flex gap-[5px] items-start p-[4px] relative w-full">
                  <button
                    onClick={() => setLoginMethod("email")}
                    className={`basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0 transition-all ${
                      loginMethod === "email" ? "bg-white shadow-[0px_2px_8px_0px_rgba(100,116,139,0.1)]" : ""
                    }`}
                  >
                    <div className="flex flex-row items-center justify-center size-full">
                      <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[5px] relative w-full">
                        <p className={`font-['Montserrat:${loginMethod === "email" ? "Medium" : "Regular"}',sans-serif] leading-[18px] relative shrink-0 text-[14px] text-nowrap tracking-[-0.14px] whitespace-pre ${
                          loginMethod === "email" ? "font-medium text-slate-900" : "font-normal text-slate-500"
                        }`}>
                          Email
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setLoginMethod("phone")}
                    className={`basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0 transition-all ${
                      loginMethod === "phone" ? "bg-white shadow-[0px_2px_8px_0px_rgba(100,116,139,0.1)]" : ""
                    }`}
                  >
                    <div className="flex flex-row items-center justify-center size-full">
                      <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[5px] relative w-full">
                        <p className={`font-['Montserrat:${loginMethod === "phone" ? "Medium" : "Regular"}',sans-serif] leading-[18px] relative shrink-0 text-[14px] text-nowrap tracking-[-0.14px] whitespace-pre ${
                          loginMethod === "phone" ? "font-medium text-slate-900" : "font-normal text-slate-500"
                        }`}>
                          Phone Number
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[24px] w-full">
              {/* Email/Phone Input */}
              {loginMethod === "email" ? (
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                  <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-nowrap text-slate-600 tracking-[-0.24px] whitespace-pre">
                    Email address
                  </p>
                  <div className="bg-slate-50 h-[38px] relative rounded-[8px] shrink-0 w-full border border-slate-200">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full h-full px-[12px] py-[7px] bg-transparent outline-none font-['Montserrat:Regular',sans-serif] font-normal text-[15px] text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              ) : (
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                  <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-nowrap text-slate-600 whitespace-pre">
                    Phone Number
                  </p>
                  <div className="bg-slate-50 h-[38px] relative rounded-[8px] shrink-0 w-full border border-slate-200">
                    <div className="flex flex-row items-center h-full px-[12px] py-[7px] gap-[13px]">
                      <div className="flex items-center gap-[10px]">
                        <svg className="w-[22px] h-[16px]" fill="none" viewBox="0 0 22 16">
                          <rect fill="white" height="16" rx="2" width="22" />
                          <path clipRule="evenodd" d="M0 0H22V1.06667H0V0ZM0 2.13333H22V3.2H0V2.13333ZM22 4.26667H0V5.33333H22V4.26667ZM0 6.4H22V7.46667H0V6.4ZM22 8.53333H0V9.6H22V8.53333ZM0 10.6667H22V11.7333H0V10.6667ZM22 12.8H0V13.8667H22V12.8Z" fill="#F93939" fillRule="evenodd" />
                          <path d="M22 14.9333H0V16H22V14.9333Z" fill="#F93939" />
                          <path clipRule="evenodd" d="M0 0H7V7.5H0V0Z" fill="#1A47B8" fillRule="evenodd" />
                          <path clipRule="evenodd" d="M1.15625 1.15625L1.65625 2.15625L0.65625 2.65625L1.65625 3.15625L1.15625 4.15625L1.65625 3.15625L2.65625 3.65625L2.15625 2.65625L3.15625 2.15625L2.15625 1.65625L2.65625 0.65625L2.15625 1.65625L1.15625 1.15625ZM4.15625 3.15625L4.65625 4.15625L3.65625 4.65625L4.65625 5.15625L4.15625 6.15625L4.65625 5.15625L5.65625 5.65625L5.15625 4.65625L6.15625 4.15625L5.15625 3.65625L5.65625 2.65625L5.15625 3.65625L4.15625 3.15625ZM1.65625 5.15625L1.15625 4.15625L0.65625 5.15625L1.65625 5.65625L0.65625 6.15625L1.65625 6.65625L1.15625 7.65625L1.65625 6.65625L2.65625 7.15625L1.65625 6.65625L2.65625 5.65625L1.65625 5.15625Z" fill="white" fillRule="evenodd" />
                        </svg>
                        <span className="font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-slate-900">+233</span>
                      </div>
                      <div className="h-[17px] w-0 border-l border-slate-300" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder=""
                        className="flex-1 bg-transparent outline-none font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Password Input */}
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-nowrap text-slate-600 tracking-[-0.24px] whitespace-pre">
                  Password
                </p>
                <div className="bg-slate-50 h-[38px] relative rounded-[8px] shrink-0 w-full border border-slate-200">
                  <div className="flex flex-row items-center h-full px-[12px] py-[7px] justify-between">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="flex-1 bg-transparent outline-none font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ml-2"
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="text-[#2D397B]" />
                      ) : (
                        <Eye size={20} className="text-[#2D397B]" />
                      )}
                    </button>
                  </div>
                </div>
                <button type="button" className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
                  <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[14px] text-nowrap text-purple-700 tracking-[-0.14px] whitespace-pre">
                    Forgot Password?
                  </p>
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`h-[40px] relative rounded-[8px] shadow-[0px_1px_4px_0px_rgba(30,41,59,0.09)] shrink-0 w-full transition-all ${
                  isFormValid ? "bg-purple-700 opacity-100 hover:bg-purple-800" : "bg-purple-700 opacity-30 cursor-not-allowed"
                }`}
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] py-[11px] relative w-full">
                    <p className="basis-0 font-['Montserrat:SemiBold',sans-serif] font-semibold grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[14px] text-center text-white">
                      Sign in
                    </p>
                  </div>
                </div>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}