"use client"
import React from 'react'
import { motion } from "framer-motion"

const StatCard = ({ name, icon: Icon, value }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-200"
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center text-sm font-medium text-gray-600">
          <Icon size={20} className="mr-2 text-blue-500" />
          {name}
        </div>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div> 
    </motion.div>
  )
}

export default StatCard