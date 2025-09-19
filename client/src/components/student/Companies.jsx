import React from "react";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";

const Companies = () => {
  const companies = [
    { logo: assets.microsoft_logo, name: "microsoft" },
    { logo: assets.walmart_logo, name: "walmart" },
    { logo: assets.adobe_logo, name: "adobe" },
    { logo: assets.accenture_logo, name: "accenture" },
    { logo: assets.paypal_logo, name: "paypal" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="pt-16 relative overflow-hidden  from-cyan-100/70 to-blue-100/50"
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: 0.3 }}
            animate={{ y: [null, -15, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <p className="text-base text-gray-600 text-center mb-2 font-medium">Trusted by learners worldwide</p>

      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 md:mt-10 mt-6 relative z-10">
        {companies.map((company, index) => (
          <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1, duration: 0.5 }} viewport={{ once: true }}
            whileHover={{ scale: 1.1, y: -5 }} className="relative group">
            <div className="bg-white/80 backdrop-blur-md p-3 rounded-xl border border-white/30 shadow-md hover:shadow-blue-500/20 transition">
              <img src={company.logo} alt={company.name} className="w-20 md:w-28 grayscale group-hover:grayscale-0 transition" />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white bg-gray-800/90 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition"> 
              {company.name.charAt(0).toUpperCase() + company.name.slice(1)}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Companies;