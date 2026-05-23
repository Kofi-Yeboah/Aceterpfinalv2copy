import svgPaths from "./svg-lp82c23a7g";

function Frame() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="font-medium leading-[normal] relative shrink-0 text-[12.562px] text-nowrap text-slate-600 tracking-[-0.2512px] whitespace-pre">Recipients</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-slate-50 relative rounded-[7.209px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0.897px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[7.209px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[12px] py-[6.281px] relative w-full">
          <p className="font-normal leading-[19.74px] relative shrink-0 text-[14.356px] text-nowrap text-slate-700 tracking-[-0.1436px] whitespace-pre">Departments</p>
        </div>
      </div>
    </div>
  );
}

function InputField() {
  return (
    <div className="content-stretch flex flex-col gap-[10.767px] items-start relative shrink-0 w-full" data-name="Input field">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[503.357px]">
      <p className="font-medium leading-[normal] relative shrink-0 text-[12.562px] text-nowrap text-slate-600 tracking-[-0.2512px] whitespace-pre">Select Departments</p>
    </div>
  );
}

function Cancel() {
  return (
    <div className="relative shrink-0 size-[21.534px]" data-name="cancel">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="cancel">
          <path d={svgPaths.pb79c280} fill="var(--fill-0, #EF4444)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[14.356px] items-center relative shrink-0 w-full">
      <p className="font-normal leading-[19.74px] relative shrink-0 text-[14.356px] text-nowrap text-slate-700 tracking-[-0.1436px] whitespace-pre">IT</p>
      <Cancel />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[8.973px] items-start px-[7.178px] py-[6.281px] relative rounded-[7.178px] shrink-0">
      <div aria-hidden="true" className="absolute border-[0.897px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[7.178px]" />
      <Frame4 />
    </div>
  );
}

function Cancel1() {
  return (
    <div className="relative shrink-0 size-[21.534px]" data-name="cancel">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="cancel">
          <path d={svgPaths.pb79c280} fill="var(--fill-0, #EF4444)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[14.356px] items-center relative shrink-0 w-full">
      <p className="font-normal leading-[19.74px] relative shrink-0 text-[14.356px] text-nowrap text-slate-700 tracking-[-0.1436px] whitespace-pre">Finance</p>
      <Cancel1 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[8.973px] items-start px-[7.178px] py-[6.281px] relative rounded-[7.178px] shrink-0">
      <div aria-hidden="true" className="absolute border-[0.897px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[7.178px]" />
      <Frame5 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[12.562px] items-center relative shrink-0">
      <Frame6 />
      <Frame7 />
    </div>
  );
}

function ExpandMore() {
  return (
    <div className="relative shrink-0 size-[21.534px]" data-name="expand_more">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="expand_more">
          <path d={svgPaths.p18b38000} fill="var(--fill-0, #94A3B8)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-slate-50 relative rounded-[7.178px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0.897px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[7.178px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[10.767px] py-[6.281px] relative w-full">
          <Frame8 />
          <ExpandMore />
        </div>
      </div>
    </div>
  );
}

function InputField1() {
  return (
    <div className="content-stretch flex flex-col gap-[10.767px] items-start relative shrink-0 w-full" data-name="Input field">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="content-stretch flex flex-col gap-[22px] items-start relative size-full" data-name="Component 124">
      <InputField />
      <InputField1 />
    </div>
  );
}