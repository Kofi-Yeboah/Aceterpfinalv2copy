import svgPaths from "./svg-ohsa42abam";
const imgRectangle4 = "https://picsum.photos/seed/1411/800/600";
const imgImage35 = "https://picsum.photos/seed/1441/800/600";

function Btn() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[38px] items-center justify-center px-[16px] py-[11px] relative rounded-[8px] shrink-0" data-name="Btn">
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]" />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-700 whitespace-pre">Discard</p>
    </div>
  );
}

function LinearMessagesConversationInboxIn() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Messages, Conversation / Inbox In">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_45481)" id="Linear / Messages, Conversation / Inbox In">
          <path d={svgPaths.p3bf5eb40} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1fc19f00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" />
          <path d={svgPaths.p280dcc00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_218_45481">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Btn1() {
  return (
    <div className="bg-purple-700 box-border content-stretch flex gap-[8px] h-[38px] items-center justify-center px-[16px] py-[11px] relative rounded-[8px] shadow-[0px_1px_4px_0px_rgba(30,41,59,0.09)] shrink-0" data-name="Btn">
      <LinearMessagesConversationInboxIn />
      <p className="font-semibold leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Save</p>
    </div>
  );
}

function Frame130() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start left-[1220px] top-[78px]">
      <Btn />
      <Btn1 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="font-normal leading-[normal] relative shrink-0 text-[12px] text-nowrap text-slate-700 tracking-[-0.24px] whitespace-pre">{`Name of role `}</p>
    </div>
  );
}

function Frame21() {
  return <div className="content-stretch flex gap-[16px] items-center shrink-0" />;
}

function Frame8() {
  return (
    <div className="bg-slate-50 h-[38px] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[8px] py-[7px] relative w-full">
          <Frame21 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function InputField() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[12px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Input field">
      <Frame13 />
      <Frame8 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
      <InputField />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="font-normal leading-[normal] relative shrink-0 text-[12px] text-nowrap text-slate-700 tracking-[-0.24px] whitespace-pre">Role description</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <p className="font-normal leading-[normal] relative shrink-0 text-[15px] text-nowrap text-slate-400 whitespace-pre">Enter role description</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="basis-0 bg-slate-50 grow min-h-px min-w-px relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex items-start justify-between px-[8px] py-[16px] relative size-full">
          <Frame20 />
        </div>
      </div>
    </div>
  );
}

function InputField1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[155px] items-start relative shrink-0 w-full" data-name="Input field">
      <Frame14 />
      <Frame9 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
      <Frame22 />
      <InputField1 />
    </div>
  );
}

function Frame131() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <p className="font-semibold leading-[24px] relative shrink-0 text-[18px] text-nowrap text-slate-800 tracking-[-0.36px] whitespace-pre">Permissions</p>
      <p className="font-normal leading-[22px] min-w-full relative shrink-0 text-[14px] text-slate-500 tracking-[-0.14px] w-[min-content]">This grants access to certain functions the user can perform. It can be used set limitations as well.</p>
    </div>
  );
}

function Check() {
  return (
    <div className="[grid-area:1_/_1] ml-[2px] mt-[2px] relative size-[12px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="check">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Switch() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Switch">
      <div className="[grid-area:1_/_1] bg-purple-700 border border-purple-700 border-solid ml-0 mt-0 rounded-[4px] size-[16px]" />
      <Check />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="Frame">
      <Switch />
    </div>
  );
}

function Frame1() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-0 py-[2px] relative shrink-0" data-name="Frame">
      <Frame />
    </div>
  );
}

function Checkbox() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Checkbox">
      <Frame1 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start min-h-px min-w-px relative shrink-0">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre">Dashboard</p>
      <p className="font-normal leading-[18px] min-w-full relative shrink-0 text-[12px] text-slate-600 w-[min-content]">User can view the main application dashboard.</p>
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex gap-[21px] items-start relative shrink-0 w-full">
      <Checkbox />
      <Frame37 />
    </div>
  );
}

function Frame45() {
  return (
    <div className="bg-slate-50 relative rounded-[12px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[20px] relative w-full">
          <Frame46 />
        </div>
      </div>
    </div>
  );
}

function Check1() {
  return (
    <div className="[grid-area:1_/_1] ml-[2px] mt-[2px] relative size-[12px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="check">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Switch1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Switch">
      <div className="[grid-area:1_/_1] bg-purple-700 border border-purple-700 border-solid ml-0 mt-0 rounded-[4px] size-[16px]" />
      <Check1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="Frame">
      <Switch1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-0 py-[2px] relative shrink-0" data-name="Frame">
      <Frame2 />
    </div>
  );
}

function Checkbox1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Checkbox">
      <Frame3 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start min-h-px min-w-px relative shrink-0">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre">Order management</p>
      <p className="font-normal leading-[18px] min-w-full relative shrink-0 text-[12px] text-slate-600 w-[min-content]">User can view the main application dashboard.</p>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex gap-[21px] items-start relative shrink-0 w-full">
      <Checkbox1 />
      <Frame38 />
    </div>
  );
}

function Frame122() {
  return (
    <div className="bg-slate-50 relative rounded-[12px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[20px] relative w-full">
          <Frame47 />
        </div>
      </div>
    </div>
  );
}

function Check2() {
  return (
    <div className="[grid-area:1_/_1] ml-[2px] mt-[2px] relative size-[12px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="check">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Switch2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Switch">
      <div className="[grid-area:1_/_1] bg-purple-700 border border-purple-700 border-solid ml-0 mt-0 rounded-[4px] size-[16px]" />
      <Check2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="Frame">
      <Switch2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-0 py-[2px] relative shrink-0" data-name="Frame">
      <Frame4 />
    </div>
  );
}

function Checkbox2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Checkbox">
      <Frame5 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start min-h-px min-w-px relative shrink-0">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre">Product management</p>
      <p className="font-normal leading-[18px] min-w-full relative shrink-0 text-[12px] text-slate-600 w-[min-content]">User can view the main application dashboard.</p>
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex gap-[21px] items-start relative shrink-0 w-full">
      <Checkbox2 />
      <Frame39 />
    </div>
  );
}

function Frame123() {
  return (
    <div className="bg-slate-50 relative rounded-[12px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[20px] relative w-full">
          <Frame48 />
        </div>
      </div>
    </div>
  );
}

function Check3() {
  return (
    <div className="[grid-area:1_/_1] ml-[2px] mt-[2px] relative size-[12px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="check">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Switch3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Switch">
      <div className="[grid-area:1_/_1] bg-purple-700 border border-purple-700 border-solid ml-0 mt-0 rounded-[4px] size-[16px]" />
      <Check3 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="Frame">
      <Switch3 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-0 py-[2px] relative shrink-0" data-name="Frame">
      <Frame6 />
    </div>
  );
}

function Checkbox3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Checkbox">
      <Frame7 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start min-h-px min-w-px relative shrink-0">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre">Inventory management</p>
      <p className="font-normal leading-[18px] min-w-full relative shrink-0 text-[12px] text-slate-600 w-[min-content]">User can view the main application dashboard.</p>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex gap-[21px] items-start relative shrink-0 w-full">
      <Checkbox3 />
      <Frame40 />
    </div>
  );
}

function Frame124() {
  return (
    <div className="bg-slate-50 relative rounded-[12px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[20px] relative w-full">
          <Frame49 />
        </div>
      </div>
    </div>
  );
}

function Check4() {
  return (
    <div className="[grid-area:1_/_1] ml-[2px] mt-[2px] relative size-[12px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="check">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Switch4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Switch">
      <div className="[grid-area:1_/_1] bg-purple-700 border border-purple-700 border-solid ml-0 mt-0 rounded-[4px] size-[16px]" />
      <Check4 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="Frame">
      <Switch4 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-0 py-[2px] relative shrink-0" data-name="Frame">
      <Frame10 />
    </div>
  );
}

function Checkbox4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Checkbox">
      <Frame11 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start min-h-px min-w-px relative shrink-0">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre">Shipment management</p>
      <p className="font-normal leading-[18px] min-w-full relative shrink-0 text-[12px] text-slate-600 w-[min-content]">User can view the main application dashboard.</p>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex gap-[21px] items-start relative shrink-0 w-full">
      <Checkbox4 />
      <Frame41 />
    </div>
  );
}

function Frame125() {
  return (
    <div className="bg-slate-50 relative rounded-[12px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[20px] relative w-full">
          <Frame50 />
        </div>
      </div>
    </div>
  );
}

function Check5() {
  return (
    <div className="[grid-area:1_/_1] ml-[2px] mt-[2px] relative size-[12px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="check">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Switch5() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Switch">
      <div className="[grid-area:1_/_1] bg-purple-700 border border-purple-700 border-solid ml-0 mt-0 rounded-[4px] size-[16px]" />
      <Check5 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="Frame">
      <Switch5 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-0 py-[2px] relative shrink-0" data-name="Frame">
      <Frame12 />
    </div>
  );
}

function Checkbox5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Checkbox">
      <Frame15 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start min-h-px min-w-px relative shrink-0">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre">User management</p>
      <p className="font-normal leading-[18px] min-w-full relative shrink-0 text-[12px] text-slate-600 w-[min-content]">User can view the main application dashboard.</p>
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex gap-[21px] items-start relative shrink-0 w-full">
      <Checkbox5 />
      <Frame42 />
    </div>
  );
}

function Frame126() {
  return (
    <div className="bg-slate-50 relative rounded-[12px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[20px] relative w-full">
          <Frame51 />
        </div>
      </div>
    </div>
  );
}

function Check6() {
  return (
    <div className="[grid-area:1_/_1] ml-[2px] mt-[2px] relative size-[12px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="check">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Switch6() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Switch">
      <div className="[grid-area:1_/_1] bg-purple-700 border border-purple-700 border-solid ml-0 mt-0 rounded-[4px] size-[16px]" />
      <Check6 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="Frame">
      <Switch6 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-0 py-[2px] relative shrink-0" data-name="Frame">
      <Frame16 />
    </div>
  );
}

function Checkbox6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Checkbox">
      <Frame17 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start min-h-px min-w-px relative shrink-0">
      <p className="font-bold leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 tracking-[-0.56px] whitespace-pre">Customer management</p>
      <p className="font-normal leading-[16px] min-w-full relative shrink-0 text-[#5f666b] text-[12px] w-[min-content]">User can view the main application dashboard.</p>
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex gap-[21px] items-start relative shrink-0 w-full">
      <Checkbox6 />
      <Frame43 />
    </div>
  );
}

function Frame127() {
  return (
    <div className="bg-slate-50 relative rounded-[12px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[20px] relative w-full">
          <Frame52 />
        </div>
      </div>
    </div>
  );
}

function Check7() {
  return (
    <div className="[grid-area:1_/_1] ml-[2px] mt-[2px] relative size-[12px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="check">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Switch7() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Switch">
      <div className="[grid-area:1_/_1] bg-purple-700 border border-purple-700 border-solid ml-0 mt-0 rounded-[4px] size-[16px]" />
      <Check7 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="Frame">
      <Switch7 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-0 py-[2px] relative shrink-0" data-name="Frame">
      <Frame18 />
    </div>
  );
}

function Checkbox7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Checkbox">
      <Frame19 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start min-h-px min-w-px relative shrink-0">
      <p className="font-bold leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 tracking-[-0.56px] whitespace-pre">Finance management</p>
      <p className="font-normal leading-[16px] min-w-full relative shrink-0 text-[#5f666b] text-[12px] w-[min-content]">User can view the main application dashboard.</p>
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex gap-[21px] items-start relative shrink-0 w-full">
      <Checkbox7 />
      <Frame44 />
    </div>
  );
}

function Frame128() {
  return (
    <div className="bg-slate-50 relative rounded-[12px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[20px] relative w-full">
          <Frame53 />
        </div>
      </div>
    </div>
  );
}

function Frame129() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame45 />
      <Frame122 />
      <Frame123 />
      <Frame124 />
      <Frame125 />
      <Frame126 />
      <Frame127 />
      <Frame128 />
    </div>
  );
}

function Frame121() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame131 />
      <Frame129 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-start left-[312px] top-[160px] w-[540px]">
      <Frame24 />
      <Frame121 />
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

function Frame55() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <MageDashboard />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Dashboard</p>
    </div>
  );
}

function SideNavItem() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame55 />
    </div>
  );
}

function BoldDuotoneUsersUser() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Bold Duotone / Users / User">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Bold Duotone / Users / User">
          <circle cx="8" cy="4" fill="var(--fill-0, #3B82F6)" id="Vector" r="2.66667" />
          <path d={svgPaths.p36341550} fill="var(--fill-0, #3B82F6)" id="Vector_2" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame57() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <BoldDuotoneUsersUser />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-blue-500 text-nowrap whitespace-pre">User management</p>
    </div>
  );
}

function SideNavItem1() {
  return (
    <div className="bg-blue-50 box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame57 />
    </div>
  );
}

function LinearMoneySafe() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Safe 2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_37223)" id="Linear / Money / Safe 2">
          <path d={svgPaths.p13370480} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p18e50000} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1e621000} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p46f3d30} fill="var(--fill-0, black)" id="Vector_4" />
          <path d="M8 8V5.33333" id="Vector_5" stroke="var(--stroke-0, black)" />
          <path d="M8 8L10.3333 9" id="Vector_6" stroke="var(--stroke-0, black)" />
          <path d="M8 8L5.66667 9" id="Vector_7" stroke="var(--stroke-0, black)" />
          <path d="M3 4.66667V6.66667" id="Vector_8" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M3 9.33333V11.3333" id="Vector_9" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_218_37223">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame58() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneySafe />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Document Vault</p>
    </div>
  );
}

function SideNavItem2() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame58 />
    </div>
  );
}

function SideNavItem3() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="side nav item">
      <SideNavItem2 />
    </div>
  );
}

function LinearMessagesConversationPlain() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Messages, Conversation / Plain 2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_37219)" id="Linear / Messages, Conversation / Plain 2">
          <path d={svgPaths.p1f9bf200} id="Vector" stroke="var(--stroke-0, black)" />
          <path d="M4 12L14 2" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_218_37219">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame59() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMessagesConversationPlain />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Notification Center</p>
    </div>
  );
}

function SideNavItem4() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame59 />
    </div>
  );
}

function SideNavItem5() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="side nav item">
      <SideNavItem4 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full">
      <SideNavItem />
      <SideNavItem1 />
      <SideNavItem3 />
      <SideNavItem5 />
    </div>
  );
}

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

function Frame28() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-purple-700 uppercase whitespace-pre">EMPLOYEE SELF-SERVICE</p>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <BoldArrowsAltArrowDown />
        </div>
      </div>
    </div>
  );
}

function LinearEssentionalUiHome() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Essentional, UI / Home">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_37187)" id="Linear / Essentional, UI / Home">
          <path d={svgPaths.p2f34d180} id="Vector" stroke="var(--stroke-0, black)" />
          <path d="M10 12H6" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_218_37187">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame60() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearEssentionalUiHome />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Home</p>
    </div>
  );
}

function SideNavItem6() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame60 />
    </div>
  );
}

function LinearUsersUserCircle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Users / User Circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19910)" id="Linear / Users / User Circle">
          <circle cx="8" cy="6" id="Vector" r="2" stroke="var(--stroke-0, black)" />
          <circle cx="8" cy="8" id="Vector_2" r="6.66667" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p2f515480} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_218_19910">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame61() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearUsersUserCircle />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">My Personal Information</p>
    </div>
  );
}

function SideNavItem7() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame61 />
    </div>
  );
}

function LinearMoneyBillList() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Bill List">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Money / Bill List">
          <path d={svgPaths.p21740880} id="Vector" stroke="var(--stroke-0, black)" />
          <path d="M7 7.33333L11.3333 7.33333" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4.66667 7.33333H5" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="1.5" />
          <path d="M4.66667 5H5" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="1.5" />
          <path d="M4.66667 9.66667H5" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="1.5" />
          <path d="M7 5H11.3333" id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="1.5" />
          <path d="M7 9.66667H11.3333" id="Vector_7" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame62() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyBillList />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Check My Payslip</p>
    </div>
  );
}

function SideNavItem8() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame62 />
    </div>
  );
}

function LineDuotoneUsersUserCheck() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Line Duotone / Users / User Check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Line Duotone / Users / User Check">
          <circle cx="8" cy="4" id="Vector" r="2.66667" stroke="var(--stroke-0, black)" />
          <circle cx="12" cy="10.6667" id="Ellipse 516" r="2.66667" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p25df9540} id="Vector 1033" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p4f51300} id="Vector_2" opacity="0.8" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame63() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LineDuotoneUsersUserCheck />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">My Requests</p>
    </div>
  );
}

function LinearArrowsAltArrowDown() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem9() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame63 />
          <LinearArrowsAltArrowDown />
        </div>
      </div>
    </div>
  );
}

function Component17() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-[256px]" data-name="Component 119">
      <SideNavItem9 />
    </div>
  );
}

function Component18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 121">
      <Component17 />
    </div>
  );
}

function LinearNotesDocumentAdd() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Notes / Document Add">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Notes / Document Add">
          <path d={svgPaths.pbd39400} id="Vector" stroke="var(--stroke-0, black)" />
          <path d="M5.33333 8.66667H7" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M5.33333 6H9.66667" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M5.33333 11.3333H6.33333" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p7fae380} id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame64() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearNotesDocumentAdd />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">My Feedback</p>
    </div>
  );
}

function SideNavItem10() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame64 />
    </div>
  );
}

function LinearArrowsActionUndoLeftRound() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows Action / Undo Left Round">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows Action / Undo Left Round">
          <path d={svgPaths.p131d1c00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame65() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearArrowsActionUndoLeftRound />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">My Refunds</p>
    </div>
  );
}

function SideNavItem11() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame65 />
    </div>
  );
}

function LinearMoneyVerifiedCheck() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Verified Check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Money / Verified Check">
          <path d={svgPaths.pa747400} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p26b2280} id="Vector_2" opacity="0.8" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame66() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyVerifiedCheck />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Approvals</p>
    </div>
  );
}

function LinearArrowsAltArrowDown1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem12() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame66 />
          <LinearArrowsAltArrowDown1 />
        </div>
      </div>
    </div>
  );
}

function Component19() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-[256px]" data-name="Component 126">
      <SideNavItem12 />
    </div>
  );
}

function Component20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 128">
      <Component19 />
    </div>
  );
}

function Frame150() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <SideNavItem6 />
      <SideNavItem7 />
      <SideNavItem8 />
      <Component18 />
      <SideNavItem10 />
      <SideNavItem11 />
      <Component20 />
    </div>
  );
}

function Frame148() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame28 />
      <Frame150 />
    </div>
  );
}

function BoldArrowsAltArrowDown1() {
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

function Frame29() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-purple-700 uppercase whitespace-pre">HR Management</p>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <BoldArrowsAltArrowDown1 />
        </div>
      </div>
    </div>
  );
}

function MageDashboard1() {
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

function Frame67() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <MageDashboard1 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Dashboard</p>
    </div>
  );
}

function SideNavItem13() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame67 />
    </div>
  );
}

function LinearMessagesConversationPen() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Messages, Conversation / Pen 2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Messages, Conversation / Pen 2">
          <path d="M2.66667 14.6667H13.3333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p1d1437c0} id="Vector_2" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame68() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMessagesConversationPen />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Application portal</p>
    </div>
  );
}

function SideNavItem14() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame68 />
    </div>
  );
}

function SideNavItem15() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="side nav item">
      <SideNavItem14 />
    </div>
  );
}

function LinearUsersUserCircle1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Users / User Circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19910)" id="Linear / Users / User Circle">
          <circle cx="8" cy="6" id="Vector" r="2" stroke="var(--stroke-0, black)" />
          <circle cx="8" cy="8" id="Vector_2" r="6.66667" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p2f515480} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_218_19910">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame69() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearUsersUserCircle1 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap tracking-[-0.42px] whitespace-pre">{`Recruitment & Onboarding`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem16() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame69 />
          <LinearArrowsAltArrowDown2 />
        </div>
      </div>
    </div>
  );
}

function Property1Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end justify-center relative shrink-0 w-[256px]" data-name="Property 1=Frame 427319507">
      <SideNavItem16 />
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 60">
      <Property1Frame1 />
    </div>
  );
}

function LineDuotoneUsersUserCheck1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Line Duotone / Users / User Check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Line Duotone / Users / User Check">
          <circle cx="8" cy="4" id="Vector" r="2.66667" stroke="var(--stroke-0, black)" />
          <circle cx="12" cy="10.6667" id="Ellipse 516" r="2.66667" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p25df9540} id="Vector 1033" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p4f51300} id="Vector_2" opacity="0.8" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame70() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LineDuotoneUsersUserCheck1 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Request Management</p>
    </div>
  );
}

function LinearArrowsAltArrowDown3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem17() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame70 />
          <LinearArrowsAltArrowDown3 />
        </div>
      </div>
    </div>
  );
}

function Component23() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-[256px]" data-name="Component 137">
      <SideNavItem17 />
    </div>
  );
}

function Component24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 138">
      <Component23 />
    </div>
  );
}

function LinearSchoolSquareAcademicCap() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / School / Square Academic Cap 2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / School / Square Academic Cap 2">
          <path d={svgPaths.p3c742900} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3355a480} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p21176280} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame71() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearSchoolSquareAcademicCap />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Training</p>
    </div>
  );
}

function SideNavItem18() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame71 />
    </div>
  );
}

function LinearBusinessStatisticChartSquare() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart Square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_37197)" id="Linear / Business, Statistic / Chart Square">
          <path d={svgPaths.p13370480} id="Vector" stroke="var(--stroke-0, black)" />
          <path d="M4.66667 12V6" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M8 12V4" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M11.3333 12V8.66667" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_218_37197">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame72() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChartSquare />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Performance Management</p>
    </div>
  );
}

function SideNavItem19() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame72 />
    </div>
  );
}

function LinearBusinessStatisticChart() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19894)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_218_19894">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame73() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem20() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame73 />
          <LinearArrowsAltArrowDown4 />
        </div>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[256px]" data-name="Component 12">
      <SideNavItem20 />
    </div>
  );
}

function Frame135() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full">
      <SideNavItem13 />
      <SideNavItem15 />
      <Component1 />
      <Component24 />
      <SideNavItem18 />
      <SideNavItem19 />
      <Component />
    </div>
  );
}

function Frame142() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame29 />
      <Frame135 />
    </div>
  );
}

function BoldArrowsAltArrowDown2() {
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

function Frame30() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-purple-700 uppercase whitespace-pre">PAYROLL Management</p>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <BoldArrowsAltArrowDown2 />
        </div>
      </div>
    </div>
  );
}

function MageDashboard2() {
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

function Frame74() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <MageDashboard2 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Dashboard</p>
    </div>
  );
}

function SideNavItem21() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame74 />
    </div>
  );
}

function LinearMoneyBillList1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Bill List">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Money / Bill List">
          <path d={svgPaths.p3a3e1800} fill="var(--stroke-0, black)" id="Vector" />
          <path d="M7 7.33333L11.3333 7.33333" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.66667 7.33333H5" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.66667 5H5" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4.66667 9.66667H5" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M7 5H11.3333" id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M7 9.66667H11.3333" id="Vector_7" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame56() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyBillList1 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Payroll</p>
    </div>
  );
}

function SideNavItem22() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative w-full">
          <Frame56 />
        </div>
      </div>
    </div>
  );
}

function LinearMoneyCardSend() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Card Send">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Money / Card Send">
          <path d={svgPaths.p3d8c3f00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p1487e400} fill="var(--stroke-0, black)" id="Vector_2" />
          <path d="M6.66667 10.6667H4" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.66667 10.6667H8.33333" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3d13eb80} id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame75() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyCardSend />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Allowances</p>
    </div>
  );
}

function SideNavItem23() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative w-full">
          <Frame75 />
        </div>
      </div>
    </div>
  );
}

function LinearMoneyCardRecive() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Card Recive">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Money / Card Recive">
          <path d={svgPaths.pe43bdc0} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p1487e400} fill="var(--stroke-0, black)" id="Vector_2" />
          <path d="M6.66667 10.6667H4" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.66667 10.6667H8.33333" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3d13eb80} id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame76() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyCardRecive />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Deductions</p>
    </div>
  );
}

function SideNavItem24() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative w-full">
          <Frame76 />
        </div>
      </div>
    </div>
  );
}

function OutlineMoneyWallet() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Outline / Money / Wallet">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Outline / Money / Wallet">
          <g id="Vector">
            <path d={svgPaths.p68c21a0} fill="var(--fill-0, black)" />
            <path clipRule="evenodd" d={svgPaths.p63a3700} fill="var(--fill-0, black)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame77() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <OutlineMoneyWallet />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Advance</p>
    </div>
  );
}

function SideNavItem25() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative w-full">
          <Frame77 />
        </div>
      </div>
    </div>
  );
}

function LinearBusinessStatisticChart1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19894)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_218_19894">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame78() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart1 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem26() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame78 />
          <LinearArrowsAltArrowDown5 />
        </div>
      </div>
    </div>
  );
}

function Component29() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[256px]" data-name="Component 147">
      <SideNavItem26 />
    </div>
  );
}

function Frame136() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full">
      <SideNavItem21 />
      <SideNavItem22 />
      <SideNavItem23 />
      <SideNavItem24 />
      <SideNavItem25 />
      <Component29 />
    </div>
  );
}

function Frame151() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame30 />
      <Frame136 />
    </div>
  );
}

function BoldArrowsAltArrowDown3() {
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

function Frame31() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-purple-700 uppercase whitespace-pre">FINANCIAL MANAGEMENT</p>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <BoldArrowsAltArrowDown3 />
        </div>
      </div>
    </div>
  );
}

function MageDashboard3() {
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

function Frame79() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <MageDashboard3 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Dashboard</p>
    </div>
  );
}

function SideNavItem27() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame79 />
    </div>
  );
}

function LinearSchoolDocument() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / School / Document">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / School / Document">
          <path d={svgPaths.p3887c480} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p388fd00} fill="var(--stroke-0, black)" id="Vector_2" />
          <path d="M5.33333 8H10.6667" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M5.33333 10.3333H9" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame80() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearSchoolDocument />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">General Ledger</p>
    </div>
  );
}

function SideNavItem28() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame80 />
    </div>
  );
}

function LinearMoneyBillList2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Bill List">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Money / Bill List">
          <path d={svgPaths.p21740880} id="Vector" stroke="var(--stroke-0, black)" />
          <path d="M7 7.33333L11.3333 7.33333" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4.66667 7.33333H5" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4.66667 5H5" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4.66667 9.66667H5" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M7 5H11.3333" id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M7 9.66667H11.3333" id="Vector_7" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame81() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyBillList2 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Expenditure Management</p>
    </div>
  );
}

function SideNavItem29() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame81 />
    </div>
  );
}

function OutlineMoneyWalletMoney() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Outline / Money / Wallet Money">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Outline / Money / Wallet Money">
          <g id="Vector">
            <path clipRule="evenodd" d={svgPaths.p3ad72600} fill="var(--fill-0, black)" fillRule="evenodd" />
            <path d={svgPaths.p8893b00} fill="var(--fill-0, black)" />
            <path clipRule="evenodd" d={svgPaths.p51e0e00} fill="var(--fill-0, black)" fillRule="evenodd" />
            <path d={svgPaths.p203f4e00} fill="var(--fill-0, black)" />
            <path clipRule="evenodd" d={svgPaths.p8893b00} fill="var(--fill-0, black)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame82() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <OutlineMoneyWalletMoney />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Budgeting</p>
    </div>
  );
}

function SideNavItem30() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame82 />
    </div>
  );
}

function LinearMoneyBanknote() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Banknote 2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Money / Banknote 2">
          <path d={svgPaths.p294ee000} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p3f2b8180} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.pd92be00} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d="M10.6667 8.66667L10.6667 6" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M3.33333 8.66667L3.33333 6" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame83() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyBanknote />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Funds Management</p>
    </div>
  );
}

function SideNavItem31() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame83 />
    </div>
  );
}

function SideNavItem32() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="side nav item">
      <SideNavItem31 />
    </div>
  );
}

function LinearMoneyWadOfMoney() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Wad Of Money">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Money / Wad Of Money">
          <path d={svgPaths.p29df88c0} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.pbdfd580} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p153e240} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d="M6 3.33333V12.3333" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M10 3.33333V12.3333" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame84() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyWadOfMoney />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Cash Management</p>
    </div>
  );
}

function SideNavItem33() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame84 />
    </div>
  );
}

function LinearMoneyMoneyBag() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Money Bag">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_37143)" id="Linear / Money / Money Bag">
          <path d={svgPaths.p16d4be00} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.pccf9f80} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p2f909c00} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_218_37143">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame85() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyMoneyBag />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Banking Management</p>
    </div>
  );
}

function SideNavItem34() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame85 />
    </div>
  );
}

function LinearNotesDocumentsMinimalistic() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Notes / Documents Minimalistic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Notes / Documents Minimalistic">
          <g clipPath="url(#clip0_218_37251)">
            <path d={svgPaths.paae8400} id="Vector" stroke="var(--stroke-0, black)" />
            <path d="M6 8.66667H10" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
            <path d="M6 6H10" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
            <path d="M6 11.3333H8" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
            <path d="M1.33333 12.6667V3.33333" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
            <path d="M14.6667 12.6667V3.33333" id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_218_37251">
            <rect fill="white" height="16" rx="5" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame86() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearNotesDocumentsMinimalistic />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Summary</p>
    </div>
  );
}

function SideNavItem35() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame86 />
    </div>
  );
}

function LinearMessagesConversationPen1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Messages, Conversation / Pen 2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Messages, Conversation / Pen 2">
          <path d="M2.66667 14.6667H13.3333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p1d1437c0} id="Vector_2" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame87() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMessagesConversationPen1 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Journal Entries</p>
    </div>
  );
}

function SideNavItem36() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame87 />
    </div>
  );
}

function LinearMoneyVerifiedCheck1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Verified Check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Money / Verified Check">
          <path d={svgPaths.pa747400} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p26b2280} id="Vector_2" opacity="0.8" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame88() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyVerifiedCheck1 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Approvals</p>
    </div>
  );
}

function LinearArrowsAltArrowDown6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem37() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame88 />
          <LinearArrowsAltArrowDown6 />
        </div>
      </div>
    </div>
  );
}

function Component21() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-[256px]" data-name="Component 131">
      <SideNavItem37 />
    </div>
  );
}

function Component22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 133">
      <Component21 />
    </div>
  );
}

function LinearBusinessStatisticChart2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19894)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_218_19894">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame89() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart2 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem38() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame89 />
          <LinearArrowsAltArrowDown7 />
        </div>
      </div>
    </div>
  );
}

function Component13() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[256px]" data-name="Component 111">
      <SideNavItem38 />
    </div>
  );
}

function Frame137() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full">
      <SideNavItem27 />
      <SideNavItem28 />
      <SideNavItem29 />
      <SideNavItem30 />
      <SideNavItem32 />
      <SideNavItem33 />
      <SideNavItem34 />
      <SideNavItem35 />
      <SideNavItem36 />
      <Component22 />
      <Component13 />
    </div>
  );
}

function Frame143() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame31 />
      <Frame137 />
    </div>
  );
}

function BoldArrowsAltArrowDown4() {
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

function Frame32() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-purple-700 uppercase whitespace-pre">Asset Management</p>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <BoldArrowsAltArrowDown4 />
        </div>
      </div>
    </div>
  );
}

function MageDashboard4() {
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

function Frame90() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <MageDashboard4 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Dashboard</p>
    </div>
  );
}

function SideNavItem39() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame90 />
    </div>
  );
}

function LinearTextFormattingEraserSquare() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Text Formatting / Eraser Square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19817)" id="Linear / Text Formatting / Eraser Square">
          <path d={svgPaths.pdfcaf0} fill="var(--stroke-0, black)" id="Vector" />
          <path d={svgPaths.p13370480} id="Vector_2" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_218_19817">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame91() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearTextFormattingEraserSquare />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Asset Management</p>
    </div>
  );
}

function LinearArrowsAltArrowDown8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem40() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame91 />
          <LinearArrowsAltArrowDown8 />
        </div>
      </div>
    </div>
  );
}

function Component4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end justify-center relative shrink-0 w-[256px]" data-name="Component 91">
      <SideNavItem40 />
    </div>
  );
}

function Component5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 93">
      <Component4 />
    </div>
  );
}

function LinearMapLocationGps() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Map & Location / GPS">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19966)" id="Linear / Map & Location / GPS">
          <path d={svgPaths.p13b7a100} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p39c76100} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d="M1.33333 8L2.66667 8" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M13.3333 8L14.6667 8" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M8 2.66667V1.33333" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M8 14.6667V13.3333" id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_218_19966">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame92() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMapLocationGps />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Asset Tracking</p>
    </div>
  );
}

function LinearArrowsAltArrowDown9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem41() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame92 />
          <LinearArrowsAltArrowDown9 />
        </div>
      </div>
    </div>
  );
}

function Component6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end justify-center relative rounded-[8px] shrink-0 w-[256px]" data-name="Component 94">
      <SideNavItem41 />
    </div>
  );
}

function Component7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 96">
      <Component6 />
    </div>
  );
}

function LinearTimeHourglass() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Time / Hourglass">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Time / Hourglass">
          <path d={svgPaths.p22c63500} id="Vector" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame93() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearTimeHourglass />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Maintenance & Lifecycle`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem42() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame93 />
          <LinearArrowsAltArrowDown10 />
        </div>
      </div>
    </div>
  );
}

function Component8() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end justify-center relative rounded-[8px] shrink-0 w-[256px]" data-name="Component 97">
      <SideNavItem42 />
    </div>
  );
}

function Component9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 99">
      <Component8 />
    </div>
  );
}

function LinearMoneyCardSend1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Card Send">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Money / Card Send">
          <path d={svgPaths.p3d8c3f00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p4695400} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M6.66667 10.6667H4" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M8.66667 10.6667H8.33333" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3d13eb80} id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame94() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyCardSend1 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Depreciation Management</p>
    </div>
  );
}

function SideNavItem43() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative w-full">
          <Frame94 />
        </div>
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center relative rounded-[8px] shrink-0 w-[256px]" data-name="Component 90">
      <SideNavItem43 />
    </div>
  );
}

function LinearEssentionalUiBoxMinimalistic() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Essentional, UI / Box Minimalistic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_20011)" id="Linear / Essentional, UI / Box Minimalistic">
          <path d={svgPaths.p30b9ca00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ecab660} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_218_20011">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame95() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearEssentionalUiBoxMinimalistic />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Inventory Management</p>
    </div>
  );
}

function LinearArrowsAltArrowDown11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem44() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame95 />
          <LinearArrowsAltArrowDown11 />
        </div>
      </div>
    </div>
  );
}

function Property1Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-[256px]" data-name="Property 1=Frame 1000004393">
      <SideNavItem44 />
    </div>
  );
}

function Component10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 103">
      <Property1Frame2 />
    </div>
  );
}

function LinearSettingsFineTuningSettings() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Settings, Fine Tuning / Settings">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Settings, Fine Tuning / Settings">
          <circle cx="8" cy="8" id="Vector" r="2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p25e14600} id="Vector_2" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame96() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearSettingsFineTuningSettings />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Settings</p>
    </div>
  );
}

function LinearArrowsAltArrowDown12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem45() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame96 />
          <LinearArrowsAltArrowDown12 />
        </div>
      </div>
    </div>
  );
}

function Component11() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-[256px]" data-name="Component 104">
      <SideNavItem45 />
    </div>
  );
}

function Component12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 106">
      <Component11 />
    </div>
  );
}

function LinearBusinessStatisticChart3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19894)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_218_19894">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame97() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart3 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem46() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame97 />
          <LinearArrowsAltArrowDown13 />
        </div>
      </div>
    </div>
  );
}

function Component14() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[256px]" data-name="Component 113">
      <SideNavItem46 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[256px]">
      <SideNavItem39 />
      <Component5 />
      <Component7 />
      <Component9 />
      <Component3 />
      <Component10 />
      <Component12 />
      <Component14 />
    </div>
  );
}

function Frame144() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[256px]">
      <Frame32 />
      <Frame27 />
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[256px]">
      <Frame26 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame148 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame142 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame151 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame143 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame144 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function BoldArrowsAltArrowDown5() {
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

function Frame33() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-purple-700 uppercase whitespace-pre">PROCUREMENT</p>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <BoldArrowsAltArrowDown5 />
        </div>
      </div>
    </div>
  );
}

function MageDashboard5() {
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

function Frame98() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <MageDashboard5 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Dashboard</p>
    </div>
  );
}

function SideNavItem47() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame98 />
    </div>
  );
}

function LinearEssentionalUiDelivery() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Essentional, UI / Delivery">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Essentional, UI / Delivery">
          <path d={svgPaths.p3a49dc0} fill="var(--stroke-0, black)" id="Vector" />
          <path d={svgPaths.pb371e00} id="Vector_2" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame99() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearEssentionalUiDelivery />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Supplier Management</p>
    </div>
  );
}

function LinearArrowsAltArrowDown14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem48() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame99 />
          <LinearArrowsAltArrowDown14 />
        </div>
      </div>
    </div>
  );
}

function Property1Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end justify-center relative rounded-[8px] shrink-0 w-[256px]" data-name="Property 1=Frame 427319503">
      <SideNavItem48 />
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 75">
      <Property1Frame />
    </div>
  );
}

function LinearFilesFileCheck() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Files / File Check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_37324)" id="Linear / Files / File Check">
          <path d={svgPaths.p27a89400} fill="var(--stroke-0, black)" id="Vector" />
          <path d={svgPaths.pcb092c0} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d="M4 11L4.88889 12L6.66667 10" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_218_37324">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame140() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <LinearFilesFileCheck />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Purchase Requisition Mgnt.</p>
    </div>
  );
}

function Frame100() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <Frame140 />
    </div>
  );
}

function SideNavItem49() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame100 />
    </div>
  );
}

function LinearMoneyBillList3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Bill List">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Money / Bill List">
          <path d={svgPaths.p21740880} id="Vector" stroke="var(--stroke-0, black)" />
          <path d="M7 7.33333L11.3333 7.33333" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4.66667 7.33333H5" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4.66667 5H5" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4.66667 9.66667H5" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M7 5H11.3333" id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M7 9.66667H11.3333" id="Vector_7" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame101() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyBillList3 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Sourcing</p>
    </div>
  );
}

function SideNavItem50() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame101 />
    </div>
  );
}

function LinearMoneyBillList4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Bill List">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Money / Bill List">
          <path d={svgPaths.p21740880} id="Vector" stroke="var(--stroke-0, black)" />
          <path d="M7 7.33333L11.3333 7.33333" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4.66667 7.33333H5" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4.66667 5H5" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4.66667 9.66667H5" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M7 5H11.3333" id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M7 9.66667H11.3333" id="Vector_7" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame102() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyBillList4 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Purchase Order Mgnt</p>
    </div>
  );
}

function SideNavItem51() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame102 />
    </div>
  );
}

function LinearFilesFileText() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Files / File Text">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_37213)" id="Linear / Files / File Text">
          <path d={svgPaths.p27a89400} fill="var(--stroke-0, black)" id="Vector" />
          <path d="M4 9.66667H9.33333" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4 12H7.66667" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.pcb092c0} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_218_37213">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame103() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearFilesFileText />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Invoices</p>
    </div>
  );
}

function SideNavItem52() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame103 />
    </div>
  );
}

function LinearBusinessStatisticChart4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19894)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_218_19894">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame104() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart4 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown15() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem53() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame104 />
          <LinearArrowsAltArrowDown15 />
        </div>
      </div>
    </div>
  );
}

function Component15() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[256px]" data-name="Component 115">
      <SideNavItem53 />
    </div>
  );
}

function Frame138() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full">
      <SideNavItem47 />
      <Component2 />
      <SideNavItem49 />
      <SideNavItem50 />
      <SideNavItem51 />
      <SideNavItem52 />
      <Component15 />
    </div>
  );
}

function Frame145() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame33 />
      <Frame138 />
    </div>
  );
}

function BoldArrowsAltArrowDown6() {
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

function Frame34() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-purple-700 uppercase whitespace-pre">PROject management</p>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <BoldArrowsAltArrowDown6 />
        </div>
      </div>
    </div>
  );
}

function MageDashboard6() {
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

function Frame105() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <MageDashboard6 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Dashboard</p>
    </div>
  );
}

function SideNavItem54() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame105 />
    </div>
  );
}

function LinearMapLocationRouting() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Map & Location / Routing">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Map & Location / Routing">
          <path d={svgPaths.p3119400} fill="var(--stroke-0, black)" id="Vector" />
          <circle cx="4" cy="3.33333" id="Vector_2" r="1.33333" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame106() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMapLocationRouting />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Project Planning & Tracking`}</p>
    </div>
  );
}

function SideNavItem55() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame106 />
    </div>
  );
}

function LinearDesignToolsRulerPen() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Design, Tools / Ruler Pen">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Design, Tools / Ruler Pen">
          <g clipPath="url(#clip0_218_37268)">
            <path d={svgPaths.p34266a80} id="Vector" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p2435000} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
            <path d={svgPaths.p34333800} id="Vector_3" stroke="var(--stroke-0, black)" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_218_37268">
            <rect fill="white" height="16" rx="5" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame107() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearDesignToolsRulerPen />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Task Management</p>
    </div>
  );
}

function SideNavItem56() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame107 />
    </div>
  );
}

function OutlineUsersUserCircle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Outline / Users / User Circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_37191)" id="Outline / Users / User Circle">
          <g id="Vector">
            <path clipRule="evenodd" d={svgPaths.p2c868200} fill="var(--fill-0, black)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p365d08c0} fill="var(--fill-0, black)" fillRule="evenodd" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_218_37191">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame108() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <OutlineUsersUserCircle />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Resource & Capacity Mgnt.`}</p>
    </div>
  );
}

function SideNavItem57() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame108 />
    </div>
  );
}

function LinearBusinessStatisticChart5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19894)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_218_19894">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame109() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart5 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown16() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem58() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame109 />
          <LinearArrowsAltArrowDown16 />
        </div>
      </div>
    </div>
  );
}

function Component25() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[256px]" data-name="Component 141">
      <SideNavItem58 />
    </div>
  );
}

function Component28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 146">
      <Component25 />
    </div>
  );
}

function Frame139() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full">
      <SideNavItem54 />
      <SideNavItem55 />
      <SideNavItem56 />
      <SideNavItem57 />
      <Component28 />
    </div>
  );
}

function Frame152() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame34 />
      <Frame139 />
    </div>
  );
}

function BoldArrowsAltArrowDown7() {
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

function Frame35() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-purple-700 uppercase whitespace-pre">{`MONITORING & EVALUATION`}</p>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <BoldArrowsAltArrowDown7 />
        </div>
      </div>
    </div>
  );
}

function MageDashboard7() {
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

function Frame110() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <MageDashboard7 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Dashboard</p>
    </div>
  );
}

function SideNavItem59() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame110 />
    </div>
  );
}

function LinearDesignToolsLayers() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Design, Tools / Layers">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Design, Tools / Layers">
          <path d={svgPaths.p3fa9d010} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p91a1ec0} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p2116ca80} id="Vector_3" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame111() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearDesignToolsLayers />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">MEL Frameworks</p>
    </div>
  );
}

function SideNavItem60() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame111 />
    </div>
  );
}

function LinearBusinessStatisticPieChart() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Pie Chart 2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Business, Statistic / Pie Chart 2">
          <path d={svgPaths.p237ca480} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p3d62d780} id="Vector_2" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame112() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticPieChart />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Indicators & Metrics`}</p>
    </div>
  );
}

function SideNavItem61() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame112 />
    </div>
  );
}

function LinearEssentionalUiDatabase() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Essentional, UI / Database">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Essentional, UI / Database">
          <path d="M2.66667 12V4" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M13.3333 4V12" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3d7b0400} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1b9a740} id="Vector_4" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p18790400} id="Vector_5" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame113() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearEssentionalUiDatabase />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Data Collection Pipelines</p>
    </div>
  );
}

function SideNavItem62() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame113 />
    </div>
  );
}

function LinearBusinessStatisticChart6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19894)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_218_19894">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame114() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart6 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown17() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem63() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame114 />
          <LinearArrowsAltArrowDown17 />
        </div>
      </div>
    </div>
  );
}

function Component26() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[256px]" data-name="Component 141">
      <SideNavItem63 />
    </div>
  );
}

function Component27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Component 143">
      <Component26 />
    </div>
  );
}

function Frame141() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full">
      <SideNavItem59 />
      <SideNavItem60 />
      <SideNavItem61 />
      <SideNavItem62 />
      <Component27 />
    </div>
  );
}

function Frame146() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame35 />
      <Frame141 />
    </div>
  );
}

function BoldArrowsAltArrowDown8() {
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

function Frame36() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-purple-700 uppercase whitespace-pre">{`CRM & ADVOCACY`}</p>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <BoldArrowsAltArrowDown8 />
        </div>
      </div>
    </div>
  );
}

function MageDashboard8() {
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

function Frame115() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <MageDashboard8 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Dashboard</p>
    </div>
  );
}

function SideNavItem64() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame115 />
    </div>
  );
}

function LinearHandsHandHeart() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Hands / Hand Heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_37242)" id="Linear / Hands / Hand Heart">
          <path d={svgPaths.p17830b00} fill="var(--stroke-0, black)" id="Vector" />
          <path d={svgPaths.p238ea400} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <rect height="5.33333" id="Rectangle 1887" rx="1" stroke="var(--stroke-0, black)" width="2" x="1.33333" y="9.33333" />
        </g>
        <defs>
          <clipPath id="clip0_218_37242">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame116() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearHandsHandHeart />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Donors</p>
    </div>
  );
}

function SideNavItem65() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame116 />
    </div>
  );
}

function LinearUsersUserCircle2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Users / User Circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19910)" id="Linear / Users / User Circle">
          <circle cx="8" cy="6" id="Vector" r="2" stroke="var(--stroke-0, black)" />
          <circle cx="8" cy="8" id="Vector_2" r="6.66667" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p2f515480} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_218_19910">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame117() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearUsersUserCircle2 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Stakeholders</p>
    </div>
  );
}

function SideNavItem66() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame117 />
    </div>
  );
}

function OutlineLikeHeartAngle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Outline / Like / Heart Angle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Outline / Like / Heart Angle">
          <path clipRule="evenodd" d={svgPaths.p39f47300} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function Frame118() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <OutlineLikeHeartAngle />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Grant Tracking</p>
    </div>
  );
}

function SideNavItem67() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame118 />
    </div>
  );
}

function LinearVideoAudioSoundVolumeSmall() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Video, Audio, Sound / Volume Small">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Video, Audio, Sound / Volume Small">
          <path d={svgPaths.p3db74300} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p3d9cdb7c} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame119() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearVideoAudioSoundVolumeSmall />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Advocacy Tracking</p>
    </div>
  );
}

function SideNavItem68() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame119 />
    </div>
  );
}

function LinearBusinessStatisticChart7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_218_19894)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_218_19894">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame120() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart7 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown18() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SideNavItem69() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame120 />
          <LinearArrowsAltArrowDown18 />
        </div>
      </div>
    </div>
  );
}

function Component16() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[256px]" data-name="Component 116">
      <SideNavItem69 />
    </div>
  );
}

function Frame149() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <SideNavItem64 />
      <SideNavItem65 />
      <SideNavItem66 />
      <SideNavItem67 />
      <SideNavItem68 />
      <Component16 />
    </div>
  );
}

function Frame147() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame36 />
      <Frame149 />
    </div>
  );
}

function Frame134() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[544px] items-center relative shrink-0 w-full">
      <Frame54 />
      <Frame145 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame152 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame146 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame147 />
    </div>
  );
}

function White() {
  return (
    <div className="absolute bg-gray-50 box-border content-stretch flex flex-col gap-[16px] h-[2528px] items-center left-0 p-[16px] top-[57px]" data-name="White">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-slate-200 border-solid inset-0 pointer-events-none" />
      <Frame134 />
    </div>
  );
}

function LinearNotificationsBell() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Linear / Notifications / Bell">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Linear / Notifications / Bell">
          <path d={svgPaths.p410ddc0} id="Vector" stroke="var(--stroke-0, white)" strokeWidth="2" />
          <path d={svgPaths.p1b51d80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <div className="relative rounded-[60px] shrink-0 size-[32px]">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[60px] size-full" src={imgRectangle4} />
      </div>
    </div>
  );
}

function Frame133() {
  return (
    <div className="content-stretch flex gap-[18px] items-center relative shrink-0">
      <LinearNotificationsBell />
      <Frame23 />
      <div className="absolute left-[14px] size-[7px] top-[5.5px]">
        <div className="absolute inset-[-9.29%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
            <circle cx="4.15" cy="4.15" fill="var(--fill-0, #FF0000)" id="Ellipse 531" r="3.5" stroke="var(--stroke-0, #030043)" strokeWidth="1.3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame132() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0">
      <div className="flex h-[26.636px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "26.625", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[26.636px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 1">
                <line id="Line 130" opacity="0.51" stroke="var(--stroke-0, white)" x2="26.6357" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame133 />
    </div>
  );
}

function Navbar() {
  return (
    <div className="absolute bg-gradient-to-l box-border content-stretch flex from-[#03003f] h-[57px] items-center justify-between pl-[28px] pr-[16px] py-[12px] right-0 to-[#0900a5] top-0 w-[1440px]" data-name="Navbar">
      <div className="h-[40px] relative shrink-0 w-[88px]" data-name="image 35">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[186.08%] left-[-19.57%] max-w-none top-[-40.82%] w-[139.14%]" src={imgImage35} />
        </div>
      </div>
      <Frame132 />
    </div>
  );
}

export default function UserManagementCreateNewRole() {
  return (
    <div className="bg-white relative size-full" data-name="user management - create new role">
      <Navbar />
      <p className="absolute font-semibold leading-[28px] left-[312px] text-[22px] text-nowrap text-slate-900 top-[83px] tracking-[-0.44px] whitespace-pre">Create a new role</p>
      <Frame130 />
      <Frame25 />
      <White />
    </div>
  );
}