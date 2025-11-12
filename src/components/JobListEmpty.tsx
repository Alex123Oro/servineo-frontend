import React from 'react'
import { IoIosCloseCircleOutline } from "react-icons/io";

export const JobListEmpty = () => {
  return (
    <div className='flex justify-center items-center gap-[5px]'>
      <IoIosCloseCircleOutline />
      <span> No hay trabajos aun </span>
    </div>  
  )
}