import { useState } from "react";

export const Input = ({labelName, type, labelContent, showToggle,value1,value2}) => {
  

  return <div className={showToggle? '' : 'hidden'}>
    <label htmlFor={labelName} className='mb-1 block'>{labelContent}</label>
    <input type={type} id={labelName} name={labelName}    value={value1} onChange={(e) => value2(e.target.value)} className='mb-4 p-1.5 rounded-md text-blackish text-sm w-full' />
    
  </div> 

  // return <>
  //   <label htmlFor={labelName} className='mb-1'>{labelContent}</label>
  //   <input type={type} id={labelName} name={labelName} required className='mb-4 p-1.5 rounded-md text-black text-sm'/>
  // </>
  

}