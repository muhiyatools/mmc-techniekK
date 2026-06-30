"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { instagramProfile, instagramPosts, type InstagramPost, type InstagramComment } from "@/lib/instagram-data";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Reveal from "../_ui/Reveal";

// --- Inline SVGs ---
const IconVerified = () => (
  <svg className="w-5 h-5 text-[#0095f6] fill-current" viewBox="0 0 24 24" aria-label="Geverifieerd">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const IconGrid = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const IconReels = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
  </svg>
);

const IconTagged = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconCarousel = () => (
  <svg className="w-5 h-5 text-white drop-shadow" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 2H8a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V4a2 2 0 00-2-2zM4 6H2v14a2 2 0 002 2h14v-2H4V6z" />
  </svg>
);

const IconVideo = () => (
  <svg className="w-5 h-5 text-white drop-shadow" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const IconHeartOutline = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const IconHeartSolid = () => (
  <svg className="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const IconComment = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const IconShare = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l5.068-2.533M8.562 12.9l5.44 2.72M21 12a3 3 0 11-6 0 3 3 0 016 0zm-6-8a3 3 0 11-6 0 3 3 0 016 0zm-6 16a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconBookmark = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

function renderCaptionText(text: string) {
  const parts = text.split(/(\s+)/);
  return parts.map((part, index) => {
    if (part.startsWith("#")) {
      return (
        <span key={index} className="text-brand font-semibold hover:underline cursor-pointer">
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function InstagramFeed() {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [lightboxPost, setLightboxPost] = useState<InstagramPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  const [localComments, setLocalComments] = useState<Record<string, InstagramComment[]>>({});
  const [newCommentText, setNewCommentText] = useState<string>("");

  const lightboxRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const filteredPosts = useMemo(() => {
    return instagramPosts.filter((post) => {
      if (activeCategory === "all") return true;
      return post.category === activeCategory;
    });
  }, [activeCategory]);

  useEffect(() => {
    if (!lightboxPost) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        navigatePost("next");
      } else if (e.key === "ArrowLeft") {
        navigatePost("prev");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    lightboxRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxPost, filteredPosts]);

  const closeLightbox = () => {
    setLightboxPost(null);
    setCarouselIndex(0);
    setNewCommentText("");
  };

  const navigatePost = (direction: "next" | "prev") => {
    if (!lightboxPost) return;
    const currentIndex = filteredPosts.findIndex((p) => p.id === lightboxPost.id);
    if (currentIndex === -1) return;

    let nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= filteredPosts.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = filteredPosts.length - 1;

    setLightboxPost(filteredPosts[nextIndex]);
    setCarouselIndex(0);
    setNewCommentText("");
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lightboxPost || !newCommentText.trim()) return;

    const newComment: InstagramComment = {
      username: "gast_gebruiker",
      text: {
        nl: newCommentText.trim(),
        en: newCommentText.trim()
      },
      time: {
        nl: "1m",
        en: "1m"
      }
    };

    setLocalComments((prev) => {
      const existing = prev[lightboxPost.id] || [];
      return {
        ...prev,
        [lightboxPost.id]: [...existing, newComment]
      };
    });

    setNewCommentText("");
  };

  const getCommentsForPost = (post: InstagramPost) => {
    const custom = localComments[post.id] || [];
    return [...post.comments, ...custom];
  };

  return (
    <>
      {/* Bio / Profile Header Section */}
      <section className="relative pt-[104px] lg:pt-[114px] bg-bg border-b border-hairline/60">
        <div className="max-w-[935px] mx-auto px-5 py-12 md:py-16">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">
              {/* Profile Avatar */}
              <div className="relative w-[150px] h-[150px] md:w-[160px] md:h-[160px] shrink-0 rounded-full border border-hairline/80 p-1 bg-white shadow-sm">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <Image
                    src={instagramProfile.avatarSrc}
                    alt={instagramProfile.fullName}
                    width={150}
                    height={150}
                    priority
                    className="w-[85%] h-auto object-contain"
                  />
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2.5 justify-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-ink">
                      {instagramProfile.username}
                    </h1>
                    {instagramProfile.isVerified && <IconVerified />}
                  </div>

                  <div className="flex items-center gap-3 justify-center sm:ml-4">
                    <a
                      href={instagramProfile.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 h-[34px] flex items-center bg-brand text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-brand-hover shadow-sm transition-all"
                    >
                      {t.pages.ourWork.follow}
                    </a>
                    <Link
                      href="/contact/"
                      className="px-6 h-[34px] flex items-center bg-white border border-hairline text-ink font-bold text-xs uppercase tracking-wider rounded-full hover:bg-concrete transition-all"
                    >
                      {t.nav.contact}
                    </Link>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex gap-8 mb-6 text-sm md:text-base justify-center md:justify-start text-ink/90 font-medium">
                  <div>
                    <span className="font-extrabold text-ink">{instagramProfile.postsCount} </span>
                    {t.pages.ourWork.posts}
                  </div>
                  <div>
                    <span className="font-extrabold text-ink">1.4k </span>
                    {t.pages.ourWork.followers}
                  </div>
                  <div>
                    <span className="font-extrabold text-ink">{instagramProfile.followingCount} </span>
                    {t.pages.ourWork.following}
                  </div>
                </div>

                {/* Bio text */}
                <div className="text-sm md:text-[0.95rem] leading-relaxed text-muted text-left">
                  <h2 className="font-bold text-ink mb-1">{instagramProfile.fullName}</h2>
                  <p className="whitespace-pre-line text-copy">
                    {language === "nl" ? instagramProfile.bio.nl : instagramProfile.bio.en}
                  </p>
                  <a
                    href={instagramProfile.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-brand font-bold hover:underline"
                  >
                    {instagramProfile.website}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tabs and Filters Section */}
      <section className="bg-bg py-6 border-b border-hairline/40">
        <div className="max-w-[935px] mx-auto px-5">
          {/* Instagram style Tabs (Posts, Reels, Tagged) */}
          <div className="flex justify-center border-b border-hairline/30 mb-8 gap-12 text-xs md:text-sm font-semibold tracking-wider text-muted">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2.5 pb-4 -mb-[1px] uppercase transition-all duration-300 ${
                activeTab === "posts"
                  ? "border-t border-ink text-ink font-extrabold"
                  : "hover:text-ink/80"
              }`}
            >
              <IconGrid />
              POSTS
            </button>
            <button
              onClick={() => setActiveTab("reels")}
              className={`flex items-center gap-2.5 pb-4 -mb-[1px] uppercase transition-all duration-300 ${
                activeTab === "reels"
                  ? "border-t border-ink text-ink font-extrabold"
                  : "hover:text-ink/80 opacity-60"
              }`}
            >
              <IconReels />
              REELS
            </button>
            <button
              onClick={() => setActiveTab("tagged")}
              className={`flex items-center gap-2.5 pb-4 -mb-[1px] uppercase transition-all duration-300 ${
                activeTab === "tagged"
                  ? "border-t border-ink text-ink font-extrabold"
                  : "hover:text-ink/80 opacity-60"
              }`}
            >
              <IconTagged />
              GETAGD
            </button>
          </div>

          {/* MMC Category filters */}
          {activeTab === "posts" && (
            <Reveal delay={100}>
              <div className="flex flex-wrap items-center justify-center gap-2 pb-4 scrollbar-none">
                {[
                  { id: "all", label: t.pages.ourWork.allCategories },
                  { id: "zonnepanelen", label: t.pages.ourWork.catSolar },
                  { id: "airco", label: t.pages.ourWork.catAirco },
                  { id: "warmtepompen", label: t.pages.ourWork.catPump },
                  { id: "meterkast", label: t.pages.ourWork.catMeter },
                  { id: "overig", label: t.pages.ourWork.catOther },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      activeCategory === cat.id
                        ? "bg-brand text-white shadow-sm shadow-brand/20 scale-[1.03]"
                        : "bg-concrete/70 hover:bg-concrete text-muted border border-hairline/35 hover:scale-[1.02]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Main Instagram Posts Grid */}
      <section className="bg-bg pb-28 lg:pb-36 min-h-[400px]">
        <div className="max-w-[935px] mx-auto px-5 py-8">
          {activeTab !== "posts" ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full border border-hairline flex items-center justify-center text-muted mb-4 opacity-50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-muted font-semibold text-lg">
                {language === "nl" ? "Geen recente Reels of Tags gevonden" : "No recent Reels or Tagged posts found"}
              </p>
              <p className="text-muted/65 text-sm mt-1">
                {language === "nl" ? "Bekijk onze posts tabblad voor onze recentste projecten." : "Check our posts tab for our latest projects."}
              </p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted font-semibold text-lg">
                {language === "nl" ? "Geen posts gevonden in deze categorie." : "No posts found in this category."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 md:gap-7">
              {filteredPosts.map((post, i) => {
                const isLiked = likedPosts[post.id];
                return (
                  <Reveal key={post.id} delay={i * 40}>
                    <button
                      onClick={() => {
                        setLightboxPost(post);
                        setCarouselIndex(0);
                      }}
                      className="group relative w-full aspect-square bg-concrete overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <Image
                        src={post.src}
                        alt={language === "nl" ? post.caption.nl : post.caption.en}
                        fill
                        priority={i < 6}
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 33vw, 300px"
                      />

                      {/* Post Type Indicators (Top Right) */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        {post.type === "carousel" && <IconCarousel />}
                        {post.type === "video" && <IconVideo />}
                      </div>

                      {/* Hover Overlay - Desktop Only */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-6 text-white font-bold text-base md:text-lg">
                        <span className="flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          {post.likesCount + (isLiked ? 1 : 0)}
                        </span>
                        <span className="flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                          <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
                          </svg>
                          {getCommentsForPost(post).length}
                        </span>
                      </div>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Advanced Lightbox Modal */}
      {lightboxPost && (
        <div
          ref={lightboxRef}
          tabIndex={-1}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10 bg-ink/95 backdrop-blur-sm cursor-zoom-out animate-fade-in"
          onClick={closeLightbox}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
          }}
          onTouchEnd={(e) => {
            const deltaX = e.changedTouches[0].clientX - touchStartX.current;
            const deltaY = e.changedTouches[0].clientY - touchStartY.current;

            // Swipe down to close on mobile
            if (deltaY > 100 && Math.abs(deltaX) < 80) {
              closeLightbox();
            }

            // Swipe left/right for carousel images inside modal
            if (lightboxPost.type === "carousel" && lightboxPost.carouselImages) {
              if (deltaX > 80 && Math.abs(deltaY) < 80) {
                setCarouselIndex((prev) => (prev > 0 ? prev - 1 : prev));
              } else if (deltaX < -80 && Math.abs(deltaY) < 80) {
                setCarouselIndex((prev) => {
                  const max = lightboxPost.carouselImages!.length - 1;
                  return prev < max ? prev + 1 : prev;
                });
              }
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Main Modal Panel */}
          <div
            className="relative w-full max-w-[900px] bg-white rounded-2xl md:rounded-r-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[80vh] cursor-default animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Side: Media Container */}
            <div className="relative w-full md:w-[60%] h-[40vh] md:h-full bg-black flex items-center justify-center select-none group/media">
              {lightboxPost.type === "carousel" && lightboxPost.carouselImages ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={lightboxPost.carouselImages[carouselIndex]}
                    alt="Carousel Slide"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 540px"
                  />

                  {/* Carousel Left Arrow */}
                  {carouselIndex > 0 && (
                    <button
                      onClick={() => setCarouselIndex((prev) => prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all shadow-md"
                    >
                      &larr;
                    </button>
                  )}

                  {/* Carousel Right Arrow */}
                  {carouselIndex < lightboxPost.carouselImages.length - 1 && (
                    <button
                      onClick={() => setCarouselIndex((prev) => prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all shadow-md"
                    >
                      &rarr;
                    </button>
                  )}

                  {/* Carousel Slide Indicators */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5">
                    {lightboxPost.carouselImages.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                          carouselIndex === idx ? "bg-brand scale-125" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <Image
                  src={lightboxPost.src}
                  alt={language === "nl" ? lightboxPost.caption.nl : lightboxPost.caption.en}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 540px"
                />
              )}
            </div>

            {/* Right Side: Profile & Comments Panel */}
            <div className="w-full md:w-[40%] flex flex-col h-[50vh] md:h-full bg-white text-ink border-t md:border-t-0 md:border-l border-hairline/65">
              {/* Header: User Profile */}
              <div className="flex items-center justify-between p-4 border-b border-hairline/60">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-hairline bg-white flex items-center justify-center">
                    <Image
                      src={instagramProfile.avatarSrc}
                      alt={instagramProfile.fullName}
                      width={32}
                      height={32}
                      className="w-[85%] h-auto object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-extrabold text-sm text-ink hover:underline cursor-pointer">
                        {instagramProfile.username}
                      </span>
                      <IconVerified />
                    </div>
                    <span className="text-[11px] text-muted font-semibold tracking-wide uppercase">
                      {lightboxPost.location}
                    </span>
                  </div>
                </div>

                <a
                  href={lightboxPost.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-brand hover:text-brand-deep transition-colors"
                >
                  Volgen
                </a>
              </div>

              {/* Scrollable Caption + Comments area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs md:text-sm scrollbar-thin">
                {/* Caption Entry */}
                <div className="flex gap-3 items-start pb-4 border-b border-hairline/35">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-hairline shrink-0 bg-white flex items-center justify-center">
                    <Image
                      src={instagramProfile.avatarSrc}
                      alt={instagramProfile.fullName}
                      width={32}
                      height={32}
                      className="w-[85%] h-auto object-contain"
                    />
                  </div>
                  <div>
                    <p className="leading-relaxed">
                      <span className="font-extrabold text-ink mr-1.5 hover:underline cursor-pointer">
                        {instagramProfile.username}
                      </span>
                      <span className="text-copy">
                        {language === "nl" ? renderCaptionText(lightboxPost.caption.nl) : renderCaptionText(lightboxPost.caption.en)}
                      </span>
                    </p>
                    <p className="text-[10px] text-muted/80 font-bold uppercase mt-2">
                      {language === "nl" ? lightboxPost.date.nl : lightboxPost.date.en}
                    </p>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {getCommentsForPost(lightboxPost).map((comment, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-concrete shrink-0 flex items-center justify-center text-[10px] font-bold text-muted border border-hairline/40">
                        {comment.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="leading-relaxed">
                          <span className="font-extrabold text-ink mr-1.5 hover:underline cursor-pointer">
                            {comment.username}
                          </span>
                          <span className="text-copy">
                            {language === "nl" ? comment.text.nl : comment.text.en}
                          </span>
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted/70 font-semibold uppercase">
                          <span>{language === "nl" ? comment.time.nl : comment.time.en}</span>
                          {comment.likes && comment.likes > 0 ? (
                            <span>{comment.likes} vind-ik-leuks</span>
                          ) : null}
                          <button className="hover:text-ink transition-colors">{t.pages.ourWork.reply}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-hairline/60 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-ink">
                    <button
                      onClick={() => toggleLike(lightboxPost.id)}
                      className={`hover:scale-115 transition-transform duration-200 ${
                        likedPosts[lightboxPost.id] ? "animate-[scaleIn_200ms_ease-out]" : ""
                      }`}
                    >
                      {likedPosts[lightboxPost.id] ? <IconHeartSolid /> : <IconHeartOutline />}
                    </button>
                    <button className="hover:scale-115 transition-transform">
                      <IconComment />
                    </button>
                    <button className="hover:scale-115 transition-transform">
                      <IconShare />
                    </button>
                  </div>
                  <button className="hover:scale-115 transition-transform text-ink">
                    <IconBookmark />
                  </button>
                </div>

                <div className="text-sm font-extrabold text-ink">
                  {lightboxPost.likesCount + (likedPosts[lightboxPost.id] ? 1 : 0)} {t.pages.ourWork.likes}
                </div>
              </div>

              {/* Add Comment Input Form */}
              <form onSubmit={handleAddComment} className="border-t border-hairline/60 flex items-center px-4 py-3 bg-white">
                <input
                  type="text"
                  placeholder={t.pages.ourWork.addComment}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 text-xs md:text-sm text-ink placeholder:text-muted/60 focus:outline-none bg-transparent pr-4 focus:ring-0 border-none"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className={`text-xs md:text-sm font-extrabold text-brand transition-colors uppercase ${
                    newCommentText.trim() ? "hover:text-brand-deep cursor-pointer" : "opacity-40 cursor-default"
                  }`}
                >
                  Post
                </button>
              </form>
            </div>
          </div>

          {/* Next / Prev Floating Navigation Controls (Desktop) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigatePost("prev");
            }}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white text-xl font-bold transition-all shadow-md"
            aria-label="Vorige post"
          >
            &larr;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigatePost("next");
            }}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white text-xl font-bold transition-all shadow-md"
            aria-label="Volgende post"
          >
            &rarr;
          </button>

          {/* Close Floating Button (Top Right) */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-200"
            aria-label={t.pages.ourWork.close}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
