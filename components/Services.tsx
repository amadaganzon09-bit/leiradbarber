"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Extended services data
const servicesData = [
    {
        id: 1,
        title: "Classic Cut",
        price: "₱350",
        category: "Hair",
        description: "Traditional scissor cut with hot towel finish.",
        image: "/images/services/1.png",
    },
    {
        id: 2,
        title: "Beard Sculpt",
        price: "₱250",
        category: "Beard",
        description: "Detailed beard trimming and shaping.",
        image: "/images/services/2.png",
    },
    {
        id: 3,
        title: "Express Facial",
        price: "₱400",
        category: "Spa",
        description: "Cleansing, exfoliating, and moisturizing treatment.",
        image: "/images/services/3.png",
    },
    {
        id: 4,
        title: "Full Service",
        price: "₱800",
        category: "Package",
        description: "Haircut, Beard Trim, and Facial.",
        image: "/images/services/4.png",
    },
];

const CATEGORIES = ["All", "Hair", "Beard", "Spa", "Package"];
const ITEMS_PER_PAGE = 4;

export default function Services() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Filter and Search logic
    const filteredServices = useMemo(() => {
        return servicesData.filter((service) => {
            const matchesCategory = activeCategory === "All" || service.category === activeCategory;
            const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    // Pagination logic
    const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
    const paginatedServices = filteredServices.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page when filter/search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, searchQuery]);

    return (
        <section id="services" className="py-24 bg-[#050505] relative overflow-hidden min-h-screen">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false, margin: "-100px" }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">Our Services</h2>
                    <p className="text-white/60 max-w-lg mx-auto mb-8">
                        Experience premium grooming services tailored to your style.
                    </p>

                    {/* Controls: Search & Filter */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto mb-12">

                        {/* Filter Tabs */}
                        <div className="flex bg-white/5 p-1 rounded-full backdrop-blur-sm overflow-x-auto max-w-full no-scrollbar">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat
                                        ? "bg-white text-black shadow-lg"
                                        : "text-white/60 hover:text-white"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-64 bg-white/5 border border-white/10 rounded-full py-2.5 px-5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/30"
                            />
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <div className="min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {paginatedServices.length > 0 ? (
                            <motion.div
                                key={currentPage + activeCategory + searchQuery}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 md:pb-0 no-scrollbar"
                            >
                                {paginatedServices.map((service, index) => (
                                    <div key={service.id} className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center">
                                        <ServiceCard service={service} index={index} />
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-white/40">
                                <p className="text-lg">No services found.</p>
                                <button onClick={() => { setSearchQuery(""); setActiveCategory("All") }} className="mt-4 text-sm text-white underline">Clear filters</button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-full bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        >
                            &larr; Prev
                        </button>
                        <div className="flex items-center gap-2 px-4">
                            <span className="text-white/60 text-sm">Page {currentPage} of {totalPages}</span>
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-full bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        >
                            Next &rarr;
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

function ServiceCard({ service, index }: { service: typeof servicesData[0]; index: number }) {
    return (
        <div
            className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
        >
            <div className="aspect-[4/5] relative bg-neutral-900">
                <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover object-top grayscale-0 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10 opacity-100" />

                <div className="absolute top-4 right-4 z-20">
                    <span className="bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/10">
                        {service.category}
                    </span>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold mb-1 text-white">{service.title}</h3>
                <p className="text-sm text-white/70 mb-3">{service.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">{service.price}</span>
                    <Link href="/login">
                        <button className="text-xs font-bold uppercase tracking-wider bg-white text-black px-4 py-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            Book
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
