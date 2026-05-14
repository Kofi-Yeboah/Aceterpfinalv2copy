import svgPaths from "./svg-2skbaverjc";

function LinearUsersUserCircle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Users / User Circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_254_523)" id="Linear / Users / User Circle">
          <circle cx="8" cy="6" id="Vector" r="2" stroke="var(--stroke-0, black)" />
          <circle cx="8" cy="8" id="Vector_2" r="6.66667" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p2f515480} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_254_523">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearUsersUserCircle />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap tracking-[-0.42px] whitespace-pre">{`Recruitment & Onboarding`}</p>
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

function SideNavItem() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame />
          <LinearArrowsAltArrowUp />
        </div>
      </div>
    </div>
  );
}

function SideNavItem1() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[228px]" data-name="side nav item">
      <p className="basis-0 font-medium grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[14px] text-black">Recruitment</p>
    </div>
  );
}

function SideNavItem2() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[228px]" data-name="side nav item">
      <p className="basis-0 font-medium grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[14px] text-black">Interviews</p>
    </div>
  );
}

function SideNavItem3() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[228px]" data-name="side nav item">
      <p className="basis-0 font-medium grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[14px] text-black">Employee Profiles</p>
    </div>
  );
}

function SideNavItem4() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[228px]" data-name="side nav item">
      <p className="basis-0 font-medium grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[14px] text-black">Job Titles</p>
    </div>
  );
}

function SideNavItem5() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[228px]" data-name="side nav item">
      <p className="basis-0 font-medium grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[14px] text-black">Contracts</p>
    </div>
  );
}

function Property1Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end justify-center relative shrink-0 w-[256px]" data-name="Property 1=Frame 427319507">
      <SideNavItem />
      <SideNavItem1 />
      <SideNavItem2 />
      <SideNavItem3 />
      <SideNavItem4 />
      <SideNavItem5 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Component 60">
      <Property1Frame />
    </div>
  );
}