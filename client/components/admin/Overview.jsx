"use client"
import StatCard from './StatCard';
import { DollarSign, ShoppingBag,  Backpack, SquareActivity} from 'lucide-react';
import React from 'react';
import {motion} from "framer-motion"


const OverviewPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 ">
    <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <motion.div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        initial= {{opacity:0, y:20}}
        animate = {{opacity:1, y:0}}
        transition={{duration:1}}
        >
        <StatCard name= "Total Orders" icon={ShoppingBag} value="$128,000"/>
        <StatCard name= "Total Products" icon={SquareActivity} value="1,873"/>
        <StatCard name= "Total Projects" icon={Backpack} value="$128,000"/>
         <StatCard name= "Total Sales" icon={DollarSign} value="$128,000"/>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      </div>
    </main>    
    </div>
  )
}

export default OverviewPage