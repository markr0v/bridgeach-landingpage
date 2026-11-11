import React, { useState, useEffect, useRef } from "react";
import "../css/card-line.css";

const testimonials = [
  {
    name: "John Doe",
    title: "CEO, TechCorp",
    quote:
      "Bridgeach has revolutionized how our team collaborates. The intuitive interface and powerful features have saved us countless hours.",
    initials: "JD",
  },
  {
    name: "Jane Smith",
    title: "CTO, InnovateX",
    quote:
      "The seamless integration and analytics capabilities have enabled our team to make data-driven decisions faster than ever before.",
    initials: "JS",
  },
  {
    name: "Robert Brown",
    title: "Product Lead, FutureLabs",
    quote:
      "Implementation was smooth and our team adapted quickly. The support team was incredibly helpful throughout the process.",
    initials: "RB",
  },
  {
    name: "Emily White",
    title: "Marketing Director, GlobalBrands",
    quote:
      "Our marketing campaigns have seen a significant boost in efficiency and reach thanks to Bridgeach's innovative solutions.",
    initials: "EW",
  },
  {
    name: "Michael Green",
    title: "Operations Manager, Streamline Inc.",
    quote:
      "Bridgeach has streamlined our operations, reducing overhead and improving overall productivity. A truly indispensable tool.",
    initials: "MG",
  },
  {
    name: "Sarah Black",
    title: "Lead Developer, CodeCrafters",
    quote:
      "As a developer, I appreciate the robust API and excellent documentation. It made integration with our existing systems a breeze.",
    initials: "SB",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const desktopCarouselRef = useRef<HTMLDivElement>(null);
  const [isDraggingDesktop, setIsDraggingDesktop] = useState(false);
  const [startXDesktop, setStartXDesktop] = useState(0);
  const [scrollLeftDesktop, setScrollLeftDesktop] = useState(0);

  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;

    let mobileInterval: NodeJS.Timeout;

    if (!isPaused) {
      // Auto-scroll for mobile

      mobileInterval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % testimonials.length);
      }, 3000); // Change testimonial every 3 seconds

      // Auto-scroll for desktop

      scrollInterval = setInterval(() => {
        if (desktopCarouselRef.current) {
          const { scrollWidth, scrollLeft } = desktopCarouselRef.current;

          // Assuming testimonials are duplicated, the effective "end" of the first set is half the total scrollWidth

          // We need to consider the gap between elements as well.

          // A more robust way is to measure the width of a single set of cards.

          // For now, let's assume originalContentWidth is roughly scrollWidth / 2.

          // This might need adjustment if card widths or gaps are not uniform.

          const originalContentWidth = scrollWidth / 2;

          if (scrollLeft >= originalContentWidth) {
            // Jump back to the start of the first set without visual interruption

            desktopCarouselRef.current.scrollLeft =
              scrollLeft - originalContentWidth;
          } else {
            desktopCarouselRef.current.scrollLeft += 1; // Adjust scroll speed as needed
          }
        }
      }, 20); // Scroll every 20ms for smoother animation

      return () => {
        clearInterval(mobileInterval);

        clearInterval(scrollInterval);
      };
    }

    return () => {
      if (mobileInterval) clearInterval(mobileInterval);

      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    setIsSwiping(false);
    const diff = startX - currentX;
    if (diff > 50) {
      // Swiped left
      setActiveIndex((current) => (current + 1) % testimonials.length);
    } else if (diff < -50) {
      // Swiped right
      setActiveIndex(
        (current) => (current - 1 + testimonials.length) % testimonials.length,
      );
    }
    setStartX(0);
    setCurrentX(0);
  };

  const handleMouseDownDesktop = (e: React.MouseEvent) => {
    setIsPaused(true);
    setIsDraggingDesktop(true);
    setStartXDesktop(e.pageX); // Store the initial pageX
    setScrollLeftDesktop(desktopCarouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMoveDesktop = (e: React.MouseEvent) => {
    if (!isDraggingDesktop) return;
    e.preventDefault();
    // Calculate how far the mouse has moved from the start point
    const deltaX = e.pageX - startXDesktop;
    if (desktopCarouselRef.current) {
      // Adjust the scroll position based on the drag distance
      desktopCarouselRef.current.scrollLeft = scrollLeftDesktop - deltaX;
    }
  };

  const handleMouseUpDesktop = () => {
    setIsPaused(false);
    setIsDraggingDesktop(false);
  };

  const handleMouseLeaveDesktop = () => {
    setIsPaused(false); // Always resume animation on mouse leave
    setIsDraggingDesktop(false); // Reset dragging state
  };

  const handleTouchStartDesktop = (e: React.TouchEvent) => {
    setIsPaused(true);
    setIsDraggingDesktop(true);
    setStartXDesktop(e.touches[0].pageX);
    setScrollLeftDesktop(desktopCarouselRef.current?.scrollLeft || 0);
  };

  const handleTouchMoveDesktop = (e: React.TouchEvent) => {
    if (!isDraggingDesktop) return;
    const deltaX = e.touches[0].pageX - startXDesktop;
    if (desktopCarouselRef.current) {
      desktopCarouselRef.current.scrollLeft = scrollLeftDesktop - deltaX;
    }
  };

  const handleTouchEndDesktop = () => {
    setIsPaused(false);
    setIsDraggingDesktop(false);
  };

  return (
    // NOTE: Section hidden on request (not deleted). Remove the "hidden" class to show it again.
    <section
      id="testimonials"
      className="hidden aurora-bg bg-linear-to-b from-white to-blue-50 py-20 dark:from-gray-900 dark:to-gray-800"
    >
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Trusted by industry leaders
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Join thousands of satisfied customers who have transformed their
            workflow.
          </p>
        </div>
        <div className="relative w-full overflow-hidden">
          {/* Mobile Carousel */}
          <div className="md:hidden relative overflow-hidden" style={{ minHeight: "350px" }}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="card w-full shrink-0 max-w-sm mx-auto py-2"
                >
                  <div className="bg uwu" style={{ inset: "6px" }} />
                  <div className="bg" style={{ inset: "6px" }} />
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 h-[280px] w-[96%] mx-auto overflow-hidden">
                    <div className="content p-8 overflow-y-hidden">
                      <div className="mb-4 flex items-center">
                        <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                          <span className="font-bold">
                            {testimonial.initials}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {testimonial.title}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 h-24 overflow-hidden text-ellipsis">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div className="mt-4 flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-3 w-3 rounded-full ${
                    index === activeIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  onClick={() => setActiveIndex(index)}
                ></button>
              ))}
            </div>
          </div>

          {/* Desktop Carousel */}
          <div className="hidden md:block">
            <div
              ref={desktopCarouselRef}
              className={`flex flex-nowrap gap-8 hide-scrollbar ${
                isPaused ? "paused" : ""
              }`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseDown={handleMouseDownDesktop}
              onMouseMove={handleMouseMoveDesktop}
              onMouseUp={handleMouseUpDesktop}
              onMouseLeave={handleMouseLeaveDesktop}
              onTouchStart={handleTouchStartDesktop}
              onTouchMove={handleTouchMoveDesktop}
              onTouchEnd={handleTouchEndDesktop}
              style={{ overflowX: "scroll", overflowY: "hidden", cursor: "grab", minHeight: "300px" }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={index}
                  className="card card-desktop shrink-0 w-full md:w-1/2 lg:w-1/3 max-w-sm py-[0.12rem]"
                  style={{ position: "relative", width: "380px", height: "259px" }}
                >
                  <div className="bg uwu" style={{ width: "380px", height: "250px", top: "6px", left: "0", position: "absolute" }} />
                  <div className="bg" style={{ width: "380px", height: "250px", top: "6px", left: "0", position: "absolute" }} />
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden" style={{ width: "374px", height: "244px", position: "absolute", top: "9px", left: "3px" }}>
                    <div className="content p-8 overflow-y-hidden">
                      <div className="mb-4 flex items-center">
                        <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                          <span className="font-bold">
                            {testimonial.initials}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {testimonial.title}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 h-24 overflow-hidden text-ellipsis">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div className="mt-4 flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;