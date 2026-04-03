import svgPaths from "./svg-bfl2kj9cou";
const imgImage36 = "https://picsum.photos/seed/1437/800/600";
const imgImage68 = "https://picsum.photos/seed/1480/800/600";

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center leading-[24px] relative shrink-0 text-center">
      <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold relative shrink-0 text-[0px] text-[18px] text-slate-900 tracking-[-0.36px] w-[352px]">
        <span>{`Sign in to `}</span>
        <span className="text-[#323584]">ACET</span>
      </p>
      <p className="font-['Montserrat:Regular',sans-serif] font-normal relative shrink-0 text-[14px] text-slate-500 tracking-[-0.28px] w-[352px]">Welcome back! Please sign in to continue</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0">
      <div className="h-[65px] relative shrink-0 w-[187px]" data-name="image 36">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <Frame8 />
    </div>
  );
}

function TabItem() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Tab item">
      <div aria-hidden="true" className="absolute border-0 border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_8px_0px_rgba(100,116,139,0.1)]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[5px] relative w-full">
          <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-nowrap text-slate-900 tracking-[-0.14px]">
            <p className="leading-[18px] whitespace-pre">Email</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabItem1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Tab item">
      <div aria-hidden="true" className="absolute border-0 border-[#d0d5dd] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[5px] relative w-full">
          <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[14px] text-nowrap text-slate-500 tracking-[-0.14px] whitespace-pre">Phone Number</p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-slate-100 relative rounded-[10px] shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex gap-[5px] items-start p-[4px] relative w-full">
          <TabItem />
          <TabItem1 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-nowrap text-slate-600 tracking-[-0.24px] whitespace-pre">Email address</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[15px] text-nowrap text-slate-400 whitespace-pre">Enter your email address</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-slate-50 h-[38px] relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative w-full">
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function InputField() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input field">
      <Frame3 />
      <Frame1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-nowrap text-slate-600 tracking-[-0.24px] whitespace-pre">Password</p>
    </div>
  );
}

function BoldSecurityEye() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Bold / Security / Eye">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Bold / Security / Eye">
          <g id="Vector">
            <path d={svgPaths.p7f55180} fill="var(--fill-0, #2D397B)" />
            <path clipRule="evenodd" d={svgPaths.pb443200} fill="var(--fill-0, #2D397B)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0">
      <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-400 whitespace-pre">Enter your password</p>
      <BoldSecurityEye />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-slate-50 h-[38px] relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative w-full">
          <Frame6 />
        </div>
      </div>
    </div>
  );
}

function HintText() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Hint text">
      <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[14px] text-nowrap text-purple-700 tracking-[-0.14px] whitespace-pre">Forgot Password?</p>
    </div>
  );
}

function InputField1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input field">
      <Frame4 />
      <Frame2 />
      <HintText />
    </div>
  );
}

function Btn() {
  return (
    <div className="bg-purple-700 h-[40px] opacity-30 relative rounded-[8px] shadow-[0px_1px_4px_0px_rgba(30,41,59,0.09)] shrink-0 w-full" data-name="Btn">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] py-[11px] relative w-full">
          <p className="basis-0 font-['Montserrat:SemiBold',sans-serif] font-semibold grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[14px] text-center text-white">Sign in</p>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[24px] items-center left-[896px] overflow-clip px-[24px] py-[32px] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(100,116,139,0.05),0px_2px_2px_0px_rgba(100,116,139,0.05),0px_0px_0px_1px_rgba(100,116,139,0.05)] top-[calc(50%-0.5px)] translate-y-[-50%]">
      <Frame9 />
      <Frame />
      <InputField />
      <InputField1 />
      <Btn />
    </div>
  );
}

export default function CreateAnAccountEmailSignIn() {
  return (
    <div className="bg-slate-100 relative size-full" data-name="Create an account - Email sign in">
      <Frame7 />
      <div className="absolute h-[1024px] left-0 top-1/2 translate-y-[-50%] w-[751px]" data-name="image 68">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage68} />
      </div>
    </div>
  );
}