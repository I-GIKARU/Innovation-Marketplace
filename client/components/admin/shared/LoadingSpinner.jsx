"use client"
import React from 'react'

const LoadingSpinner = ({ size = 16, className = "" }) => {
  return (
    <div className={`animate-spin rounded-full border-b-2 border-current ${className}`} 
         style={{ height: size, width: size }}>
    </div>
  )
}

export default LoadingSpinner
