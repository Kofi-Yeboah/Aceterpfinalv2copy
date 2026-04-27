import svgPaths from "./svg-c9xbjw1tkc";

function Frame9() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex h-full items-center justify-center px-[17px] py-[5px] relative rounded-[20px] shrink-0">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">Not uploaded</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#060606] text-[25px] tracking-[0.25px] whitespace-nowrap">
        <p className="leading-[normal]">Concept Notes</p>
      </div>
      <div className="flex flex-row items-center self-stretch">
        <Frame9 />
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame />
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#a0a0a0] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">Nothing here.....</p>
      </div>
    </div>
  );
}

function LinearNotesDocument() {
  return (
    <div className="relative shrink-0 size-[17px]" data-name="Linear / Notes / Document">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="Linear / Notes / Document">
          <path d={svgPaths.p1ec0a700} id="Vector" stroke="var(--stroke-0, #1E293B)" strokeWidth="1.0625" />
          <path d="M5.66667 7.08333H11.3333" id="Vector_2" stroke="var(--stroke-0, #1E293B)" strokeLinecap="round" strokeWidth="1.0625" />
          <path d="M5.66667 9.91667H9.20833" id="Vector_3" stroke="var(--stroke-0, #1E293B)" strokeLinecap="round" strokeWidth="1.0625" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <LinearNotesDocument />
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#060606] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">Download template</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-white content-stretch flex h-[34px] items-center px-[14px] py-[2px] relative rounded-[6px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#dfdfdf] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Frame3 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#060606] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">Input details</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white content-stretch flex h-[34px] items-center px-[14px] py-[2px] relative rounded-[6px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#dfdfdf] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Frame4 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#060606] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">Upload document</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white content-stretch flex h-[34px] items-center px-[14px] py-[2px] relative rounded-[6px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#dfdfdf] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Frame8 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame2 />
      <Frame5 />
      <Frame6 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame11 />
      <Frame7 />
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start p-[20px] relative rounded-[14px] size-full">
      <Frame10 />
    </div>
  );
}