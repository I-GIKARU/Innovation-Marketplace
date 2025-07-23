"use client"
import React from 'react'
import {motion} from "framer-motion"

const StatCard = ({name,icon:Icon, value}) => {
  return (
    <motion.div whileHover= {{y:-5}}className="bg-[#bbbbbb] backdrop-blur md-overflow-hidden shadow-lg rounded-xl ">
    <div className="px-4 py-5 sm:p-6">
        <span className="flex-items-center text-sm font-medium text-black-300">
            <Icon size={20} className="mr-2"/>
            {name}
            </span>
            <p className="mt-1 text-3xl font-semi-bold text-black-300">{value}</p>
        
    </div> 
    </motion.div>
  )
}

export default StatCard