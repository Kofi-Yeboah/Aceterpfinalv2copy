import svgPaths from "./svg-3ndofat8o9";
const imgRectangle4 = "https://picsum.photos/seed/1411/800/600";
const imgImage35 = "https://picsum.photos/seed/1441/800/600";

function LinearEssentionalUiAddCircle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Essentional, UI / Add Circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_19272)" id="Linear / Essentional, UI / Add Circle">
          <circle cx="12" cy="12" id="Vector" r="10" stroke="var(--stroke-0, white)" strokeWidth="1.5" />
          <path d={svgPaths.p20feca80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_50_19272">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Btn() {
  return (
    <div className="bg-purple-700 box-border content-stretch flex gap-[8px] h-[38px] items-center justify-center px-[16px] py-[11px] relative shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)] shrink-0" data-name="Btn">
      <LinearEssentionalUiAddCircle />
      <p className="font-semibold leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Add New Task</p>
    </div>
  );
}

function BtnGroupWithDropdown() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-center overflow-clip relative rounded-[8px] shadow-[0px_2px_8px_0px_rgba(100,116,139,0.1)] shrink-0" data-name="BTN group/With dropdown">
      <Btn />
    </div>
  );
}

function Frame162() {
  return (
    <div className="absolute content-stretch flex h-[38px] items-center justify-between left-[312px] min-w-[1104px] top-[78px] w-[1104px]">
      <p className="font-semibold leading-[28px] relative shrink-0 text-[22px] text-nowrap text-slate-900 tracking-[-0.44px] whitespace-pre">Task Management</p>
      <BtnGroupWithDropdown />
    </div>
  );
}

function OutlineSearchRoundedMagnifer() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Outline / Search / Rounded Magnifer">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Outline / Search / Rounded Magnifer">
          <path clipRule="evenodd" d={svgPaths.p118d0870} fill="var(--fill-0, #94A3B8)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="basis-0 content-stretch flex gap-[16px] grow items-center min-h-px min-w-px relative shrink-0">
      <OutlineSearchRoundedMagnifer />
      <p className="font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-400 whitespace-pre">{`Search `}</p>
    </div>
  );
}

function Frame138() {
  return (
    <div className="bg-white box-border content-stretch flex h-[38px] items-center justify-between px-[16px] py-[11px] relative rounded-[8px] shrink-0 w-[221px]">
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]" />
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <p className="font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre">Export</p>
    </div>
  );
}

function LinearArrowsActionExport() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows Action / Export">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows Action / Export">
          <g clipPath="url(#clip0_50_19226)">
            <path d={svgPaths.p2ed72e5c} id="Vector" stroke="var(--stroke-0, #7E22CE)" strokeLinecap="round" strokeWidth="1.5" />
            <path d={svgPaths.p1821db80} id="Vector_2" stroke="var(--stroke-0, #071F7D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_50_19226">
            <rect fill="white" height="16" rx="5" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[15px] h-[38px] items-center px-[12px] py-[7px] relative shrink-0">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-slate-200 border-solid inset-0 pointer-events-none" />
      <Frame3 />
      <LinearArrowsActionExport />
    </div>
  );
}

function InputField() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="Input field">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-slate-500 border-solid inset-0 pointer-events-none" />
      <Frame />
    </div>
  );
}

function DatePicker() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Date picker">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit]">
        <InputField />
      </div>
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_8px_0px_rgba(100,116,139,0.1)]" />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <p className="font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre">Upload CSV</p>
    </div>
  );
}

function LinearWeatherCloudUpload() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Weather / Cloud Upload">
      <div className="absolute bottom-[-41.25%] left-0 right-[-42.19%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
          <g id="Linear / Weather / Cloud Upload">
            <path d={svgPaths.pdbc9ee0} id="Vector" stroke="var(--stroke-0, #7E22CE)" strokeLinecap="round" strokeWidth="1.5" />
            <path d={svgPaths.p3f7e6190} id="Vector_2" stroke="var(--stroke-0, #071F7D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[12px] h-[38px] items-center px-[12px] py-[7px] relative shrink-0">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-slate-200 border-solid inset-0 pointer-events-none" />
      <Frame4 />
      <LinearWeatherCloudUpload />
    </div>
  );
}

function InputField1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="Input field">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-slate-500 border-solid inset-0 pointer-events-none" />
      <Frame1 />
    </div>
  );
}

function DatePicker1() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Date picker">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit]">
        <InputField1 />
      </div>
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]" />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <p className="font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre">All Projects</p>
    </div>
  );
}

function LinearArrowsAltArrowDown() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #7E22CE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function AllLocations() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[12px] h-[38px] items-center px-[12px] py-[7px] relative shrink-0" data-name="All Locations">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-slate-200 border-solid inset-0 pointer-events-none" />
      <Frame5 />
      <LinearArrowsAltArrowDown />
    </div>
  );
}

function InputField2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="Input field">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-slate-500 border-solid inset-0 pointer-events-none" />
      <AllLocations />
    </div>
  );
}

function DatePicker2() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Date picker">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit]">
        <InputField2 />
      </div>
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]" />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <p className="font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre">All Statuses</p>
    </div>
  );
}

function LinearArrowsAltArrowDown1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #7E22CE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function AllLocations1() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[12px] h-[38px] items-center px-[12px] py-[7px] relative shrink-0" data-name="All Locations">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-slate-200 border-solid inset-0 pointer-events-none" />
      <Frame6 />
      <LinearArrowsAltArrowDown1 />
    </div>
  );
}

function InputField3() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="Input field">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-slate-500 border-solid inset-0 pointer-events-none" />
      <AllLocations1 />
    </div>
  );
}

function DatePicker3() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Date picker">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit]">
        <InputField3 />
      </div>
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]" />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <p className="font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre">All Time</p>
    </div>
  );
}

function LinearArrowsAltArrowDown2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #7E22CE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function AllLocations2() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[12px] h-[38px] items-center px-[12px] py-[7px] relative shrink-0" data-name="All Locations">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-slate-200 border-solid inset-0 pointer-events-none" />
      <Frame7 />
      <LinearArrowsAltArrowDown2 />
    </div>
  );
}

function InputField4() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="Input field">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-slate-500 border-solid inset-0 pointer-events-none" />
      <AllLocations2 />
    </div>
  );
}

function DatePicker4() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Date picker">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit]">
        <InputField4 />
      </div>
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]" />
    </div>
  );
}

function Frame155() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <DatePicker />
      <DatePicker1 />
      <DatePicker2 />
      <DatePicker3 />
      <DatePicker4 />
    </div>
  );
}

function Frame140() {
  return (
    <div className="content-stretch flex items-center justify-between min-w-[1104px] relative shrink-0 w-full">
      <Frame138 />
      <Frame155 />
    </div>
  );
}

function TableCellHeading() {
  return (
    <div className="bg-blue-800 h-[47px] relative shrink-0 w-full" data-name="Table cell heading">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[47px] items-center p-[16px] relative w-full">
          <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Task Name</p>
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] w-full">Finalize Survey Instrument Design</p>
    </div>
  );
}

function Frame53() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame22 />
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] w-full">Conduct Internal Peer Review of Draft</p>
    </div>
  );
}

function Frame59() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame23 />
        </div>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] w-full">Complete Literature Review</p>
    </div>
  );
}

function Frame56() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame24 />
        </div>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] w-full">Schedule Project Kick-off Meeting</p>
    </div>
  );
}

function Frame57() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame25 />
        </div>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] w-full">Draft Stakeholder Engagement Plan</p>
    </div>
  );
}

function Frame58() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame27 />
        </div>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[268px]">
      <TableCellHeading />
      <Frame53 />
      <Frame59 />
      <Frame56 />
      <Frame57 />
      <Frame58 />
    </div>
  );
}

function TableCellHeading1() {
  return (
    <div className="bg-blue-800 box-border content-stretch flex gap-[10px] items-center p-[16px] relative shrink-0 w-[119.667px]" data-name="Table cell heading">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Phase</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start justify-center relative shrink-0">
      <p className="font-normal leading-none relative shrink-0 text-[12px] text-nowrap text-slate-600 whitespace-pre">1</p>
    </div>
  );
}

function TableCells() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full" data-name="Table cells">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame28 />
        </div>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start justify-center relative shrink-0">
      <p className="font-normal leading-none relative shrink-0 text-[12px] text-nowrap text-slate-600 whitespace-pre">2</p>
    </div>
  );
}

function TableCells1() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full" data-name="Table cells">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame29 />
        </div>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start justify-center relative shrink-0">
      <p className="font-normal leading-none relative shrink-0 text-[12px] text-nowrap text-slate-600 whitespace-pre">4</p>
    </div>
  );
}

function TableCells2() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full" data-name="Table cells">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame30 />
        </div>
      </div>
    </div>
  );
}

function Frame52() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <TableCellHeading1 />
      <TableCells />
      <TableCells1 />
      <TableCells />
      <TableCells2 />
      <TableCells />
    </div>
  );
}

function TableCellHeading2() {
  return (
    <div className="bg-blue-800 h-[47px] relative shrink-0 w-full" data-name="Table cell heading">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[47px] items-center p-[16px] relative w-full">
          <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Associated Project</p>
        </div>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] w-full">West Africa Regional Integration Study</p>
    </div>
  );
}

function Frame54() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame31 />
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] w-full">Climate Finance Readiness Program</p>
    </div>
  );
}

function Frame60() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame32 />
        </div>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] w-full">Renewable Energy Transition Framework</p>
    </div>
  );
}

function Frame61() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame33 />
        </div>
      </div>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[287px]">
      <TableCellHeading2 />
      {[...Array(3).keys()].map((_, i) => (
        <Frame54 key={i} />
      ))}
      <Frame60 />
      <Frame61 />
    </div>
  );
}

function TableCellHeading3() {
  return (
    <div className="bg-blue-800 box-border content-stretch flex gap-[10px] items-center p-[16px] relative shrink-0 w-[119.667px]" data-name="Table cell heading">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Assigned To</p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] text-nowrap whitespace-pre">Yaw Osei</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame35 />
        </div>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] text-nowrap whitespace-pre">Kofi Mensah</p>
    </div>
  );
}

function Frame45() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame36 />
        </div>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] text-nowrap whitespace-pre">Kwesi Appiah</p>
    </div>
  );
}

function Frame142() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame38 />
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] text-nowrap whitespace-pre">Nana Yaw</p>
    </div>
  );
}

function Frame141() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame39 />
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0">
      <p className="font-medium leading-[normal] relative shrink-0 text-[#667085] text-[12px] text-nowrap whitespace-pre">Kwaku Anane</p>
    </div>
  );
}

function Frame143() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame40 />
        </div>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <TableCellHeading3 />
      <Frame26 />
      <Frame45 />
      <Frame142 />
      <Frame141 />
      <Frame143 />
    </div>
  );
}

function TableCellHeading4() {
  return (
    <div className="bg-blue-800 box-border content-stretch flex gap-[10px] items-center pl-[12px] pr-[16px] py-[16px] relative shrink-0 w-[119.667px]" data-name="Table cell heading">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Due Date</p>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start justify-center relative shrink-0">
      <p className="font-normal leading-none relative shrink-0 text-[12px] text-nowrap text-slate-600 whitespace-pre">Mar 15, 2025</p>
    </div>
  );
}

function TableCells3() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full" data-name="Table cells">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center pl-[12px] pr-[16px] py-[16px] relative w-full">
          <Frame41 />
        </div>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start justify-center relative shrink-0">
      <p className="font-normal leading-none relative shrink-0 text-[12px] text-nowrap text-slate-600 whitespace-pre">Nov 8, 2025</p>
    </div>
  );
}

function TableCells4() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full" data-name="Table cells">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center pl-[12px] pr-[16px] py-[16px] relative w-full">
          <Frame42 />
        </div>
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start justify-center relative shrink-0">
      <p className="font-normal leading-none relative shrink-0 text-[12px] text-nowrap text-slate-600 whitespace-pre">Jul 4, 2025</p>
    </div>
  );
}

function TableCells5() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full" data-name="Table cells">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center pl-[12px] pr-[16px] py-[16px] relative w-full">
          <Frame43 />
        </div>
      </div>
    </div>
  );
}

function Frame62() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <TableCellHeading4 />
      <TableCells3 />
      <TableCells4 />
      {[...Array(2).keys()].map((_, i) => (
        <TableCells5 key={i} />
      ))}
      <TableCells3 />
    </div>
  );
}

function TableCellHeading5() {
  return (
    <div className="bg-blue-800 box-border content-stretch flex gap-[10px] items-center p-[16px] relative shrink-0 w-[117px]" data-name="Table cell heading">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-semibold grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[12px] text-white">Status</p>
    </div>
  );
}

function Frame46() {
  return (
    <div className="bg-red-50 box-border content-stretch flex flex-col gap-[4px] items-start justify-center overflow-clip px-[8px] py-[4px] relative rounded-[12px] shrink-0">
      <p className="font-medium leading-none relative shrink-0 text-[12px] text-nowrap text-red-600 whitespace-pre">Overdue</p>
    </div>
  );
}

function TableCells6() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full" data-name="Table cells">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame46 />
        </div>
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div className="bg-green-50 box-border content-stretch flex flex-col gap-[4px] items-start justify-center overflow-clip px-[8px] py-[4px] relative rounded-[12px] shrink-0">
      <p className="font-medium leading-none relative shrink-0 text-[12px] text-green-600 text-nowrap whitespace-pre">Completed</p>
    </div>
  );
}

function TableCells7() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full" data-name="Table cells">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame47 />
        </div>
      </div>
    </div>
  );
}

function Frame48() {
  return (
    <div className="bg-blue-50 box-border content-stretch flex flex-col gap-[4px] items-start justify-center overflow-clip px-[8px] py-[4px] relative rounded-[12px] shrink-0">
      <p className="font-medium leading-none relative shrink-0 text-[12px] text-blue-500 text-nowrap whitespace-pre">In Progress</p>
    </div>
  );
}

function TableCells8() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full" data-name="Table cells">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[72px] items-center p-[16px] relative w-full">
          <Frame48 />
        </div>
      </div>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <TableCellHeading5 />
      <TableCells6 />
      <TableCells7 />
      <TableCells7 />
      <TableCells8 />
      <TableCells7 />
    </div>
  );
}

function TableCellHeading6() {
  return (
    <div className="bg-blue-800 box-border content-stretch flex gap-[10px] items-center justify-center p-[16px] relative rounded-tr-[8px] shrink-0 w-[73px]" data-name="Table cell heading">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none rounded-tr-[8px]" />
      <p className="font-semibold leading-[normal] relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Action</p>
    </div>
  );
}

function BoldEssentionalUiMenuDots() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Bold / Essentional, UI / Menu Dots">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Bold / Essentional, UI / Menu Dots">
          <g id="Vector">
            <path d={svgPaths.pa4a5600} fill="var(--fill-0, #1E40AF)" />
            <path d={svgPaths.p3ca15c00} fill="var(--fill-0, #1E40AF)" />
            <path d={svgPaths.p288b0b80} fill="var(--fill-0, #1E40AF)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[6px] py-[8px] relative shrink-0 w-[40px]">
      <BoldEssentionalUiMenuDots />
    </div>
  );
}

function TableCells9() {
  return (
    <div className="bg-white h-[72px] relative shrink-0 w-full" data-name="Table cells">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-slate-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[72px] items-center justify-center p-[16px] relative w-full">
          <Frame21 />
        </div>
      </div>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0">
      <TableCellHeading6 />
      {[...Array(5).keys()].map((_, i) => (
        <TableCells9 key={i} />
      ))}
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex items-start overflow-clip relative shrink-0 w-full">
      <Frame49 />
      <Frame52 />
      <Frame55 />
      <Frame51 />
      <Frame62 />
      <Frame44 />
      <Frame50 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <p className="font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre">10 per page</p>
    </div>
  );
}

function LinearArrowsAltArrowDown3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Arrows / Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Arrows / Alt Arrow Down">
          <path d="M12.6667 6L8 10L3.33333 6" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function ViewPerPage() {
  return (
    <div className="bg-white box-border content-stretch flex h-[38px] items-center justify-between px-[8px] py-[7px] relative rounded-[10px] shrink-0 w-[136px]" data-name="view per page">
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Frame8 />
      <LinearArrowsAltArrowDown3 />
    </div>
  );
}

function LineDuotoneArrowsAltArrowLeft() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Line Duotone / Arrows / Alt Arrow Left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Line Duotone / Arrows / Alt Arrow Left">
          <path d="M10 3.33333L6 8L10 12.6667" id="Vector" stroke="var(--stroke-0, #475569)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Btn1() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-full items-center justify-center px-[12px] py-[11px] relative shrink-0 w-[32px]" data-name="Btn">
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-[-1px] pointer-events-none shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]" />
      <LineDuotoneArrowsAltArrowLeft />
    </div>
  );
}

function Frame63() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[32px]">
      <p className="font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-600 whitespace-pre">1</p>
    </div>
  );
}

function Frame65() {
  return (
    <div className="bg-slate-200 box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[4px] shrink-0 size-[24px]">
      <p className="font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-900 whitespace-pre">2</p>
    </div>
  );
}

function Frame66() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[32px]">
      <p className="font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-600 whitespace-pre">...</p>
    </div>
  );
}

function Frame67() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[32px]">
      <p className="font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-600 whitespace-pre">7</p>
    </div>
  );
}

function Frame64() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[32px]">
      <p className="font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-600 whitespace-pre">8</p>
    </div>
  );
}

function LineDuotoneArrowsAltArrowRight() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Line Duotone / Arrows / Alt Arrow Right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Line Duotone / Arrows / Alt Arrow Right">
          <path d="M6 3.33333L10 8L6 12.6667" id="Vector" stroke="var(--stroke-0, #475569)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Btn2() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-full items-center justify-center px-[12px] py-[11px] relative shrink-0 w-[32px]" data-name="Btn">
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-[-1px] pointer-events-none shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]" />
      <LineDuotoneArrowsAltArrowRight />
    </div>
  );
}

function Pagination() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0" data-name="Pagination">
      <div className="content-stretch flex h-[32px] items-center justify-center overflow-clip relative rounded-[inherit]">
        <Btn1 />
        <Frame63 />
        <Frame65 />
        <Frame66 />
        <Frame67 />
        <Frame64 />
        <Btn2 />
      </div>
      <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_8px_0px_rgba(100,116,139,0.1)]" />
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex gap-[18px] items-center relative shrink-0">
      <p className="font-normal leading-none relative shrink-0 text-[12px] text-center text-nowrap text-slate-600 whitespace-pre">11-20 of 84 results</p>
      <Pagination />
    </div>
  );
}

function FullPagination() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Full pagination">
      <ViewPerPage />
      <Frame68 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-end px-[16px] py-[8px] relative w-full">
          <FullPagination />
        </div>
      </div>
    </div>
  );
}

function Frame139() {
  return (
    <div className="content-stretch flex flex-col h-[806px] items-start justify-between overflow-clip relative shrink-0 w-full">
      <Frame37 />
      <Frame34 />
    </div>
  );
}

function Frame163() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[36px] items-start left-[312px] top-[142px] w-[1104px]">
      <Frame140 />
      <Frame139 />
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

function Frame70() {
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
      <Frame70 />
    </div>
  );
}

function LinearUsersUser() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Users / User">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Users / User">
          <ellipse cx="8" cy="4" id="Vector" rx="2.66667" ry="2.66667" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p36341550} id="Vector_2" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame72() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearUsersUser />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">User management</p>
    </div>
  );
}

function SideNavItem1() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame72 />
    </div>
  );
}

function LinearMoneySafe() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Safe 2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_19193)" id="Linear / Money / Safe 2">
          <path d={svgPaths.p13370480} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.pd5ff600} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1e621000} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p46f3d30} fill="var(--fill-0, black)" id="Vector_4" />
          <path d="M8 8V5.33333" id="Vector_5" stroke="var(--stroke-0, black)" />
          <path d="M8 8L10.3333 9" id="Vector_6" stroke="var(--stroke-0, black)" />
          <path d="M8 8L5.66667 9" id="Vector_7" stroke="var(--stroke-0, black)" />
          <path d="M3 4.66667V6.66667" id="Vector_8" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M3 9.33333V11.3333" id="Vector_9" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_50_19193">
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
      <LinearMoneySafe />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Document Vault</p>
    </div>
  );
}

function SideNavItem2() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame73 />
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
        <g clipPath="url(#clip0_50_18885)" id="Linear / Messages, Conversation / Plain 2">
          <path d={svgPaths.p11b39800} id="Vector" stroke="var(--stroke-0, black)" />
          <path d="M4 12L14 2" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_50_18885">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame74() {
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
      <Frame74 />
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

function Frame10() {
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

function Frame12() {
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
        <g clipPath="url(#clip0_50_19120)" id="Linear / Essentional, UI / Home">
          <path d={svgPaths.p22e85a80} id="Vector" stroke="var(--stroke-0, black)" />
          <path d="M10 12H6" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_50_19120">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame75() {
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
      <Frame75 />
    </div>
  );
}

function LinearUsersUserCircle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Users / User Circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_19211)" id="Linear / Users / User Circle">
          <circle cx="8" cy="6" id="Vector" r="2" stroke="var(--stroke-0, black)" />
          <circle cx="8" cy="8" id="Vector_2" r="6.66667" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p2f515480} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_50_19211">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame76() {
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
      <Frame76 />
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

function Frame77() {
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
      <Frame77 />
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

function Frame78() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LineDuotoneUsersUserCheck />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">My Requests</p>
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

function SideNavItem9() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame78 />
          <LinearArrowsAltArrowDown4 />
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

function Frame79() {
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
      <Frame79 />
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

function Frame80() {
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
      <Frame80 />
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

function Frame81() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyVerifiedCheck />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Approvals</p>
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

function SideNavItem12() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame81 />
          <LinearArrowsAltArrowDown5 />
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

function Frame161() {
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

function Frame159() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame12 />
      <Frame161 />
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
            <path d={svgPaths.p3f21b080} fill="var(--stroke-0, #7E22CE)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame13() {
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

function Frame82() {
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
      <Frame82 />
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

function Frame83() {
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
      <Frame83 />
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
        <g clipPath="url(#clip0_50_18983)" id="Linear / Users / User Circle">
          <circle cx="8" cy="6" id="Vector" r="2" stroke="var(--stroke-0, black)" />
          <circle cx="8" cy="8" id="Vector_2" r="6.66667" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p2f515480} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_50_18983">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame84() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearUsersUserCircle1 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap tracking-[-0.42px] whitespace-pre">{`Recruitment & Onboarding`}</p>
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

function SideNavItem16() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame84 />
          <LinearArrowsAltArrowDown6 />
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

function Frame85() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LineDuotoneUsersUserCheck1 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Request Management</p>
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

function SideNavItem17() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame85 />
          <LinearArrowsAltArrowDown7 />
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
          <path d={svgPaths.pef2400} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3355a480} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p21176280} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame86() {
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
      <Frame86 />
    </div>
  );
}

function LinearBusinessStatisticChartSquare() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart Square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_18937)" id="Linear / Business, Statistic / Chart Square">
          <path d={svgPaths.p13370480} id="Vector" stroke="var(--stroke-0, black)" />
          <path d="M4.66667 12V6" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M8 12V4" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M11.3333 12V8.66667" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_50_18937">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame87() {
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
      <Frame87 />
    </div>
  );
}

function LinearBusinessStatisticChart() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_19124)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_50_19124">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame88() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
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

function SideNavItem20() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame88 />
          <LinearArrowsAltArrowDown8 />
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

function Frame145() {
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

function Frame152() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame13 />
      <Frame145 />
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

function Frame14() {
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

function Frame89() {
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
      <Frame89 />
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

function Frame71() {
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
          <Frame71 />
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

function Frame90() {
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
          <Frame90 />
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

function Frame91() {
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
          <Frame91 />
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

function Frame92() {
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
          <Frame92 />
        </div>
      </div>
    </div>
  );
}

function LinearBusinessStatisticChart1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_19124)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_50_19124">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame93() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart1 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
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

function SideNavItem26() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame93 />
          <LinearArrowsAltArrowDown9 />
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

function Frame146() {
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

function Frame164() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame14 />
      <Frame146 />
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
            <path d={svgPaths.p3f21b080} fill="var(--stroke-0, #7E22CE)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame15() {
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

function Frame94() {
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
      <Frame94 />
    </div>
  );
}

function LinearSchoolDocument() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / School / Document">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / School / Document">
          <path d={svgPaths.p3887c480} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p5e2ca00} fill="var(--stroke-0, black)" id="Vector_2" />
          <path d="M5.33333 8H10.6667" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M5.33333 10.3333H9" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame95() {
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
      <Frame95 />
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

function Frame96() {
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
      <Frame96 />
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

function Frame97() {
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
      <Frame97 />
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

function Frame98() {
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
      <Frame98 />
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

function Frame99() {
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
      <Frame99 />
    </div>
  );
}

function LinearMoneyMoneyBag() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Money / Money Bag">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_18895)" id="Linear / Money / Money Bag">
          <path d={svgPaths.p16d4be00} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.pccf9f80} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p2f909c00} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_50_18895">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame100() {
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
      <Frame100 />
    </div>
  );
}

function LinearNotesDocumentsMinimalistic() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Notes / Documents Minimalistic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Notes / Documents Minimalistic">
          <g clipPath="url(#clip0_50_19234)">
            <path d={svgPaths.p1286ad00} id="Vector" stroke="var(--stroke-0, black)" />
            <path d="M6 8.66667H10" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
            <path d="M6 6H10" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
            <path d="M6 11.3333H8" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
            <path d="M1.33333 12.6667V3.33333" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
            <path d="M14.6667 12.6667V3.33333" id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_50_19234">
            <rect fill="white" height="16" rx="5" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame101() {
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
      <Frame101 />
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

function Frame102() {
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
      <Frame102 />
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

function Frame103() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMoneyVerifiedCheck1 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Approvals</p>
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

function SideNavItem37() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame103 />
          <LinearArrowsAltArrowDown10 />
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
        <g clipPath="url(#clip0_50_19124)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_50_19124">
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
      <LinearBusinessStatisticChart2 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
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

function SideNavItem38() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame104 />
          <LinearArrowsAltArrowDown11 />
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

function Frame147() {
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

function Frame153() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame15 />
      <Frame147 />
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

function Frame16() {
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

function Frame105() {
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
      <Frame105 />
    </div>
  );
}

function LinearTextFormattingEraserSquare() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Text Formatting / Eraser Square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_19066)" id="Linear / Text Formatting / Eraser Square">
          <path d={svgPaths.pdfcaf0} fill="var(--stroke-0, black)" id="Vector" />
          <path d={svgPaths.p13370480} id="Vector_2" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_50_19066">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame106() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearTextFormattingEraserSquare />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Asset Management</p>
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

function SideNavItem40() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame106 />
          <LinearArrowsAltArrowDown12 />
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
        <g clipPath="url(#clip0_50_18869)" id="Linear / Map & Location / GPS">
          <path d={svgPaths.p13b7a100} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p39c76100} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d="M1.33333 8L2.66667 8" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M13.3333 8L14.6667 8" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M8 2.66667V1.33333" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M8 14.6667V13.3333" id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_50_18869">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame107() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearMapLocationGps />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Asset Tracking</p>
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

function SideNavItem41() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame107 />
          <LinearArrowsAltArrowDown13 />
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

function Frame108() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearTimeHourglass />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Maintenance & Lifecycle`}</p>
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

function SideNavItem42() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame108 />
          <LinearArrowsAltArrowDown14 />
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

function Frame109() {
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
          <Frame109 />
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
        <g clipPath="url(#clip0_50_19027)" id="Linear / Essentional, UI / Box Minimalistic">
          <path d={svgPaths.p30b9ca00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ecab660} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_50_19027">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame110() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearEssentionalUiBoxMinimalistic />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Inventory Management</p>
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

function SideNavItem44() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame110 />
          <LinearArrowsAltArrowDown15 />
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

function Frame111() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearSettingsFineTuningSettings />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Settings</p>
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

function SideNavItem45() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame111 />
          <LinearArrowsAltArrowDown16 />
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
        <g clipPath="url(#clip0_50_19124)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_50_19124">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame112() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart3 />
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

function SideNavItem46() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame112 />
          <LinearArrowsAltArrowDown17 />
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

function Frame11() {
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

function Frame154() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[256px]">
      <Frame16 />
      <Frame11 />
    </div>
  );
}

function Frame69() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[256px]">
      <Frame10 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame159 />
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
      <Frame164 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame153 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame154 />
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
            <path d={svgPaths.p3f21b080} fill="var(--stroke-0, #7E22CE)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
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

function Frame113() {
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
      <Frame113 />
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

function Frame114() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearEssentionalUiDelivery />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Supplier Management</p>
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

function SideNavItem48() {
  return (
    <div className="h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="side nav item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[38px] items-center justify-between pl-[12px] pr-0 py-[7px] relative w-full">
          <Frame114 />
          <LinearArrowsAltArrowDown18 />
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
        <g clipPath="url(#clip0_50_19172)" id="Linear / Files / File Check">
          <path d={svgPaths.pc731100} fill="var(--stroke-0, black)" id="Vector" />
          <path d={svgPaths.pcb092c0} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d="M4 11L4.88889 12L6.66667 10" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_50_19172">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame150() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <LinearFilesFileCheck />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Purchase Requisition Mgnt.</p>
    </div>
  );
}

function Frame115() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <Frame150 />
    </div>
  );
}

function SideNavItem49() {
  return (
    <div className="box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame115 />
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

function Frame116() {
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
      <Frame116 />
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

function Frame117() {
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
      <Frame117 />
    </div>
  );
}

function LinearFilesFileText() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Files / File Text">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_18857)" id="Linear / Files / File Text">
          <path d={svgPaths.pc731100} fill="var(--stroke-0, black)" id="Vector" />
          <path d="M4 9.66667H9.33333" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d="M4 12H7.66667" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.pcb092c0} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_50_18857">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame118() {
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
      <Frame118 />
    </div>
  );
}

function LinearBusinessStatisticChart4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_19124)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_50_19124">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame119() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart4 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown19() {
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
          <Frame119 />
          <LinearArrowsAltArrowDown19 />
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

function Frame148() {
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

function Frame156() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame17 />
      <Frame148 />
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
            <path d={svgPaths.p3f21b080} fill="var(--stroke-0, #7E22CE)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame18() {
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

function Frame120() {
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
      <Frame120 />
    </div>
  );
}

function LinearMapLocationRouting() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Map & Location / Routing">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Map & Location / Routing">
          <path d={svgPaths.p3119400} fill="var(--stroke-0, black)" id="Vector" />
          <ellipse cx="4" cy="3.33333" id="Vector_2" rx="1.33333" ry="1.33333" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame121() {
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
      <Frame121 />
    </div>
  );
}

function BoldDuotoneDesignToolsRulerPen() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Bold Duotone / Design, Tools / Ruler Pen">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Bold Duotone / Design, Tools / Ruler Pen">
          <path d={svgPaths.p45e1980} fill="var(--fill-0, #3B82F6)" id="Vector" opacity="0.5" />
          <g id="Vector_2">
            <path d={svgPaths.pa37c900} fill="var(--fill-0, #3B82F6)" />
            <path d={svgPaths.p2f5c5e80} fill="var(--fill-0, #3B82F6)" />
            <path d={svgPaths.pa940880} fill="var(--fill-0, #3B82F6)" />
            <path d={svgPaths.pcc2d680} fill="var(--fill-0, #3B82F6)" />
            <path d={svgPaths.p2d46f000} fill="var(--fill-0, #3B82F6)" />
          </g>
          <path d={svgPaths.p3510c880} fill="var(--fill-0, #3B82F6)" id="Vector_3" />
          <path d={svgPaths.p207ce80} fill="var(--fill-0, #3B82F6)" id="Vector_4" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame122() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <BoldDuotoneDesignToolsRulerPen />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-blue-500 text-nowrap whitespace-pre">Task Management</p>
    </div>
  );
}

function SideNavItem56() {
  return (
    <div className="bg-blue-50 box-border content-stretch flex h-[38px] items-center justify-between px-[12px] py-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="side nav item">
      <Frame122 />
    </div>
  );
}

function OutlineUsersUserCircle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Outline / Users / User Circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_18851)" id="Outline / Users / User Circle">
          <g id="Vector">
            <path clipRule="evenodd" d={svgPaths.p2c868200} fill="var(--fill-0, black)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p3bbbd100} fill="var(--fill-0, black)" fillRule="evenodd" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_50_18851">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame123() {
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
      <Frame123 />
    </div>
  );
}

function LinearBusinessStatisticChart5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_18931)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_50_18931">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame124() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart5 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown20() {
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
          <Frame124 />
          <LinearArrowsAltArrowDown20 />
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

function Frame149() {
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

function Frame165() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame18 />
      <Frame149 />
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
            <path d={svgPaths.p3f21b080} fill="var(--stroke-0, #7E22CE)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame19() {
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

function Frame125() {
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
      <Frame125 />
    </div>
  );
}

function LinearDesignToolsLayers() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Design, Tools / Layers">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Linear / Design, Tools / Layers">
          <path d={svgPaths.p31e04900} id="Vector" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p6e24600} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1bf13f80} id="Vector_3" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Frame126() {
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
      <Frame126 />
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

function Frame127() {
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
      <Frame127 />
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

function Frame128() {
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
      <Frame128 />
    </div>
  );
}

function LinearBusinessStatisticChart6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_19124)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_50_19124">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame129() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart6 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown21() {
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
          <Frame129 />
          <LinearArrowsAltArrowDown21 />
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

function Frame151() {
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

function Frame157() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame19 />
      <Frame151 />
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
            <path d={svgPaths.p3f21b080} fill="var(--stroke-0, #7E22CE)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame20() {
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

function Frame130() {
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
      <Frame130 />
    </div>
  );
}

function LinearHandsHandHeart() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Hands / Hand Heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_18839)" id="Linear / Hands / Hand Heart">
          <path d={svgPaths.p17830b00} fill="var(--stroke-0, black)" id="Vector" />
          <path d={svgPaths.p27205300} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <rect height="5.33333" id="Rectangle 1887" rx="1" stroke="var(--stroke-0, black)" width="2" x="1.33333" y="9.33333" />
        </g>
        <defs>
          <clipPath id="clip0_50_18839">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame131() {
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
      <Frame131 />
    </div>
  );
}

function LinearUsersUserCircle2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Users / User Circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_19211)" id="Linear / Users / User Circle">
          <circle cx="8" cy="6" id="Vector" r="2" stroke="var(--stroke-0, black)" />
          <circle cx="8" cy="8" id="Vector_2" r="6.66667" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p2f515480} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip0_50_19211">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame132() {
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
      <Frame132 />
    </div>
  );
}

function OutlineLikeHeartAngle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Outline / Like / Heart Angle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Outline / Like / Heart Angle">
          <path clipRule="evenodd" d={svgPaths.p2c7eec00} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function Frame133() {
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
      <Frame133 />
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

function Frame134() {
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
      <Frame134 />
    </div>
  );
}

function LinearBusinessStatisticChart7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Linear / Business, Statistic / Chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_50_19124)" id="Linear / Business, Statistic / Chart">
          <path d="M14.6667 14.6667H1.33333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" />
          <path d={svgPaths.p3ac51b10} id="Vector_2" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p1a5aa680} id="Vector_3" stroke="var(--stroke-0, black)" />
          <path d={svgPaths.p239cea80} id="Vector_4" stroke="var(--stroke-0, black)" />
        </g>
        <defs>
          <clipPath id="clip0_50_19124">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame135() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0">
      <LinearBusinessStatisticChart7 />
      <p className="font-medium leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">{`Reporting & Analytics`}</p>
    </div>
  );
}

function LinearArrowsAltArrowDown22() {
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
          <Frame135 />
          <LinearArrowsAltArrowDown22 />
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

function Frame160() {
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

function Frame158() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[256px]">
      <Frame20 />
      <Frame160 />
    </div>
  );
}

function Frame144() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[544px] items-center relative shrink-0 w-full">
      <Frame69 />
      <Frame156 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame165 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame157 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
            <line id="Line 160" stroke="var(--stroke-0, #E2E8F0)" x2="256" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame158 />
    </div>
  );
}

function White() {
  return (
    <div className="absolute bg-gray-50 box-border content-stretch flex flex-col gap-[16px] h-[2676px] items-center left-0 p-[16px] top-[57px]" data-name="White">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-slate-200 border-solid inset-0 pointer-events-none" />
      <Frame144 />
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

function Frame9() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <div className="relative rounded-[60px] shrink-0 size-[32px]">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[60px] size-full" src={imgRectangle4} />
      </div>
    </div>
  );
}

function Frame137() {
  return (
    <div className="content-stretch flex gap-[18px] items-center relative shrink-0">
      <LinearNotificationsBell />
      <Frame9 />
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

function Frame136() {
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
      <Frame137 />
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
      <Frame136 />
    </div>
  );
}

export default function TaskManagement() {
  return (
    <div className="bg-white relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] size-full" data-name="Task Management">
      <Navbar />
      <Frame162 />
      <Frame163 />
      <White />
    </div>
  );
}