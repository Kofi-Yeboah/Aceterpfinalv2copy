import svgPaths from "./svg-48s160c3ee";

function BoldArrowsAltArrowDown() {
  return (
    <div className="relative size-[16px]" data-name="Bold / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Bold / Arrows / Alt Arrow Down">
          <g id="Vector">
            <path d={svgPaths.p3b9caa00} fill="var(--fill-0, #7E22CE)" />
            <path d={svgPaths.p3ef88840} fill="var(--stroke-0, #7E22CE)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-purple-700 uppercase whitespace-pre">PAYROLL Management</p>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <BoldArrowsAltArrowDown />
        </div>
      </div>
    </div>
  );
}

function MageDashboard() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="mage:dashboard">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="mage:dashboard">
          <path d={svgPaths.p28b08500} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <MageDashboard />
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Dashboard</p>
    </div>
  );
}

function SideNavItem() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame1 />
    </div>
  );
}

function LinearMoneyBillList() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Bill List">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_270_2089)" id="Linear / Money / Bill List">
          <path d={svgPaths.p1b777f80} fill="var(--stroke-0, black)" id="Vector" />
          <path d="M10.5 11L17 11" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 11H7.5" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 7.5H7.5" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M7 14.5H7.5" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M10.5 7.5H17" id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M10.5 14.5H17" id="Vector_7" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_270_2089">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyBillList />
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Payroll</p>
    </div>
  );
}

function SideNavItem1() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative w-full">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function LinearMoneyCardSend() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Card Send">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_270_2068)" id="Linear / Money / Card Send">
          <path d={svgPaths.p23978400} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p37dca4c0} fill="var(--stroke-0, black)" id="Vector_2" />
          <path d="M10 16H6" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 16H12.5" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M2 10L22 10" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_270_2068">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyCardSend />
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Allowances</p>
    </div>
  );
}

function SideNavItem2() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative w-full">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function LinearMoneyCardRecive() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Card Recive">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_270_2082)" id="Linear / Money / Card Recive">
          <path d={svgPaths.p3e171000} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p37dca4c0} fill="var(--stroke-0, black)" id="Vector_2" />
          <path d="M10 16H6" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 16H12.5" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M2 10L22 10" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_270_2082">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyCardRecive />
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Deductions</p>
    </div>
  );
}

function SideNavItem3() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative w-full">
          <Frame4 />
        </div>
      </div>
    </div>
  );
}

function OutlineMoneyWallet() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Outline / Money / Wallet">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_270_2065)" id="Outline / Money / Wallet">
          <g id="Vector">
            <path d={svgPaths.p29085f00} fill="var(--fill-0, black)" />
            <path clipRule="evenodd" d={svgPaths.pafdf600} fill="var(--fill-0, black)" fillRule="evenodd" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_270_2065">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <OutlineMoneyWallet />
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Advance</p>
    </div>
  );
}

function SideNavItem4() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative w-full">
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function LinearBusinessStatisticChart() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_270_1338)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_270_1338">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart />
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowUp() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Up">
          <path d="M12.6667 10L8 6L3.33333 10" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem5() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame6 />
          <LinearArrowsAltArrowUp />
        </div>
      </div>
    </div>
  );
}

function SideNavItem6() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[228px]" data-name="side nav item">
      <p className="basis-0 font-['Montserrat:Medium',sans-serif] font-medium grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[14px] text-black">Payroll Report</p>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[256px]" data-name="Component 147">
      <SideNavItem5 />
      <SideNavItem6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full">
      <SideNavItem />
      <SideNavItem1 />
      <SideNavItem2 />
      <SideNavItem3 />
      <SideNavItem4 />
      <Component />
    </div>
  );
}

export default function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative size-full">
      <Frame />
      <Frame7 />
    </div>
  );
}