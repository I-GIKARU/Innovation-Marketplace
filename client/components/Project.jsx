import React from 'react'
import Image from 'next/image';



const Projects = () => {
  return (
    <>
    <section className="bg-[#D9D9D9] py-12 px-5">
        <h3 className="text-4xl md:text-4xl font-extrabold text-gray-900 text-center mb-7" >Featured <span className="text-orange-500">Projects</span></h3>
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
    <div className="flex flex-col items-center bg-[#001f3f] border rounded-lg shadow-lg p-4 max-w-sm mx-auto">
  <Image src="/images/tours.jpg"alt="tours van" width={400} height={200}className="rounded-lg shadow-md"/>
  <p className="text-white text-sm text-center mt-4">
    Moringa students create brilliant software projects — built with real problems in mind.
    But after demo day, those projects often disappear. Interact with the best of designs crafted with top-notch experience.
  </p>
  </div>


   <div className="flex flex-col items-center bg-orange-300 border rounded-lg shadow-lg p-4 max-w-sm mx-auto">
  <Image src="/images/ecommerce.jpg"alt="tours van" width={400} height={200}className="rounded-lg shadow-md"/>
  <p className="text-white text-sm text-center mt-4">
    Moringa students create brilliant software projects — built with real problems in mind.
    But after demo day, those projects often disappear. Interact with the best of designs crafted with top-notch experience.
  </p>
  </div>

    <div className="flex flex-col items-center bg-rose-300 border rounded-lg shadow-lg p-4 max-w-sm mx-auto">
  <Image src="/images/healthhub.jpg"alt="tours van" width={400} height={200}className="rounded-lg shadow-md"/>
  <p className="text-white text-sm text-center mt-4">
    Moringa students create brilliant software projects — built with real problems in mind.
    But after demo day, those projects often disappear. Interact with the best of designs crafted with top-notch experience.
  </p>
  </div>

    <div className="flex flex-col items-center bg-gray-700 border rounded-lg shadow-lg p-4 max-w-sm mx-auto">
  <Image src="/images/foodcourt.jpg"alt="tours van" width={400} height={200}className="rounded-lg shadow-md"/>
  <p className="text-white text-sm text-center mt-4">
    Moringa students create brilliant software projects — built with real problems in mind.
    But after demo day, those projects often disappear. Interact with the best of designs crafted with top-notch experience.
  </p>
  </div>
    </div>
     </section>
    </>
  )
}

export default Projects;








