
import { cn } from '@/lib/utils';
import React from 'react';

const Loader = ({ className }) => {
  return (
    <div className={cn('sl_icon_loader', className)}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle className="non-s two-yellow-dot" cx="20" cy="50" r="10" fill="yellow" />
        <circle className="non-s three-green-dot" cx="40" cy="50" r="10" fill="green" />
        <circle className="non-s four-light-green-dot" cx="60" cy="50" r="10" fill="lightgreen" />
        <circle className="non-s five-light-blue-dot" cx="80" cy="50" r="10" fill="lightblue" />
        <circle className="non-s six-dark-blue-dot" cx="100" cy="50" r="10" fill="darkblue" />
        <circle className="non-s seven-purple-dot" cx="120" cy="50" r="10" fill="purple" />
      </svg>
    </div>
  );
};

export default Loader;




















// import { cn } from '@/lib/utils';

// const Loader = ({ className }) => {
//   return (
//     <div className={cn('sl_icon_loader', className)}>
//       <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//         {/* Example SVG content */}
//         <circle className="two-yellow-dot" cx="30" cy="50" r="5" fill="yellow" />
//         <circle className="three-green-dot" cx="50" cy="50" r="5" fill="green" />
//         <circle className="four-light-green-dot" cx="70" cy="50" r="5" fill="lightgreen" />
//         <circle className="five-light-blue-dot" cx="90" cy="50" r="5" fill="lightblue" />
//         <circle className="six-dark-blue-dot" cx="10" cy="50" r="5" fill="darkblue" />
//         <circle className="seven-purple-dot" cx="50" cy="30" r="5" fill="purple" />
//         {/* Additional SVG shapes and animations based on your design */}
//       </svg>
//     </div>
//   );
// };

// export default Loader;












// import { cn } from '@/lib/utils';
// import { Loader2 } from 'lucide-react';

// const Loader = ({ className }) => {
//   return (
//     <Loader2
//       className={cn('h-16 w-16 text-main animate-spin', className)}
//     />
//   );
// };

// export default Loader;

