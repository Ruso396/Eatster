// import React, { useEffect, useState } from "react";
// import { support_data } from "../Constant.js";
// import FAQItem from "../FAQItem.js";

// const Help = () => {
//   const init = support_data
//     .filter((x) => x.title === "General issues")
//     .map((x) => x.data);
//   const titles = support_data.map((data) => data.title);
//   const [helpTitle, setHelpTitle] = useState([]);
//   const [FAQ, setFAQ] = useState([]);
//   const [activeTitle, setActiveTitle] = useState(false);

//   useEffect(() => {
//     setHelpTitle(titles);
//     setActiveTitle(0);
//     setFAQ(...init);
//   }, []);

//   const handleClick = (event, index) => {
//     event.preventDefault();
//     const text = event.target.textContent;
//     const qna = support_data.filter((x) => x.title === text);
//     setFAQ(...qna.map((x) => x.data));
//     setActiveTitle(index);
//   };

//   return (
//     <div className="min-h-screen bg-[#E0DDDA] w-full pt-20 pb-12">
//       <div className="w-full px-4 sm:px-6 md:px-10">
//         {/* Header */}
//         <div className="text-black px-2 sm:px-4 md:px-6">
//           <div className="flex flex-col pt-10 px-2 sm:px-4 max-w-[90%] sm:max-w-[80%] md:max-w-[70%] mx-auto">
//             <h1 className="mt-4 font-extrabold text-2xl sm:text-3xl">
//               Help & Support
//             </h1>
//             <h4 className="pt-2 pb-10 font-light text-sm sm:text-base">
//               Let's take a step ahead and help you better.
//             </h4>
//           </div>

//           {/* Main Content */}
//           <div className="flex flex-col md:flex-row bg-white text-[#545a79] p-4 sm:p-6 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto">
//             {/* Sidebar */}
//             <div className="bg-[#edf1f7] sticky top-20 list-none w-full md:w-fit mb-6 md:mb-0">
//               {helpTitle.map((curr, index) => (
//                 <div
//                   key={index}
//                   className={`ml-2 py-3 px-4 text-xs font-normal cursor-pointer transition-all duration-200 ${
//                     activeTitle === index
//                       ? "bg-white font-bold text-black"
//                       : "text-[#8a8b91] hover:text-black hover:font-bold"
//                   }`}
//                   onClick={(event) => handleClick(event, index)}
//                 >
//                   <a
//                     href="#"
//                     className={`ml-4 no-underline ${
//                       activeTitle === index
//                         ? "font-bold text-black"
//                         : "text-inherit"
//                     }`}
//                   >
//                     {curr}
//                   </a>
//                 </div>
//               ))}
//             </div>

//             {/* FAQ Section */}
//             <div className="w-full md:pl-10 pt-2 md:pt-0">
//               {FAQ.map((curr, index) => (
//                 <FAQItem {...curr} key={curr.id} index={index} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Help;



import React, { useEffect, useState } from "react";
import { support_data } from "../Constant.js";
import FAQItem from "../FAQItem.js";

const Help = () => {
  const init = support_data
    .filter((x) => x.title === "General issues")
    .map((x) => x.data);
  const titles = support_data.map((data) => data.title);
  const [helpTitle, setHelpTitle] = useState([]);
  const [FAQ, setFAQ] = useState([]);
  const [activeTitle, setActiveTitle] = useState(0); // Initialize with 0 directly

  useEffect(() => {
    setHelpTitle(titles);
    setFAQ(...init);
  }, [init, titles]); // Added init and titles to dependency array

  const handleClick = (event, index) => {
    event.preventDefault(); // Prevent default anchor behavior
    const text = event.target.textContent;
    const qna = support_data.filter((x) => x.title === text);
    setFAQ(...qna.map((x) => x.data));
    setActiveTitle(index);
  };

  return (
    <div className="min-h-screen bg-[#E0DDDA] w-full pt-20 pb-12">
      <div className="w-full px-4 sm:px-6 md:px-10">
        {/* Header */}
        <div className="text-black px-2 sm:px-4 md:px-6">
          <div className="flex flex-col pt-10 px-2 sm:px-4 max-w-[90%] sm:max-w-[80%] md:max-w-[70%] mx-auto">
            <h1 className="mt-4 font-extrabold text-2xl sm:text-3xl">
              Help & Support
            </h1>
            <h4 className="pt-2 pb-10 font-light text-sm sm:text-base">
              Let's take a step ahead and help you better.
            </h4>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row bg-white text-[#545a79] p-4 sm:p-6 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto">
            {/* Sidebar */}
            <div className="bg-[#edf1f7] sticky top-20 list-none w-full md:w-fit mb-6 md:mb-0">
              {helpTitle.map((curr, index) => (
                <div
                  key={index}
                  className={`ml-2 py-3 px-4 text-xs font-normal cursor-pointer transition-all duration-200 ${
                    activeTitle === index
                      ? "bg-white font-bold text-black"
                      : "text-[#8a8b91] hover:text-black hover:font-bold"
                  }`}
                  onClick={(event) => handleClick(event, index)}
                >
                  {/* Changed <a> to <button> for accessibility */}
                  <button
                    className={`ml-4 no-underline bg-transparent border-none p-0 cursor-pointer ${
                      activeTitle === index
                        ? "font-bold text-black"
                        : "text-inherit"
                    }`}
                  >
                    {curr}
                  </button>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="w-full md:pl-10 pt-2 md:pt-0">
              {FAQ.map((curr, index) => (
                <FAQItem {...curr} key={curr.id} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;