import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const SwipeCards = ({ user, isEdit = false }) => {
  const [cards, setCards] = useState([]);
  const [removedCards, setRemovedCards] = useState(new Set());

  useEffect(() => {
    if (user && Array.isArray(user)) {
      const filteredUsers = user.filter((u) => !removedCards.has(u._id));

      // Only update if the filtered data is actually different
      if (JSON.stringify(filteredUsers) !== JSON.stringify(cards)) {
        setCards(filteredUsers);
      }
    }
  }, [user, removedCards]);

  const emptyState = useMemo(
    () => (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-sm mx-auto bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-3xl shadow-2xl p-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">All Caught Up!</h3>
        <p className="text-gray-400 text-center leading-relaxed">
          You've reviewed all available profiles. Check back later for more
          developers to connect with!
        </p>
        <div className="mt-6 inline-flex items-center px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2"></div>
          No more profiles
        </div>
      </div>
    ),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-sm">
        {cards.map((card, index) => (
          <Card
            key={card._id}
            {...card}
            id={index}
            cards={cards}
            setCards={setCards}
            setRemovedCards={setRemovedCards}
            isEdit={isEdit}
          />
        ))}
        {cards.length === 0 && emptyState}
      </div>
    </div>
  );
};

const Card = ({
  _id,
  id,
  firstName,
  lastName,
  photoUrl,
  skills,
  age,
  gender,
  about,
  setCards,
  setRemovedCards,
  cards,
  isEdit,
}) => {
  const x = useMotionValue(0);
  const dispatch = useDispatch();

  const isFront = useMemo(
    () => cards.length > 0 && _id === cards[cards.length - 1]._id,
    [_id, cards]
  );

  const offset = useMemo(() => (isFront ? 0 : id % 2 ? 3 : -3), [isFront, id]);

  const rotateRaw = useTransform(x, [-150, 150], [-12, 12]);
  const rotate = useTransform(rotateRaw, (value) => `${value + offset}deg`);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const opacityLeft = useTransform(x, [0, -100], [0, 1]);
  const opacityRight = useTransform(x, [0, 100], [0, 1]);

  const handleSendRequest = useCallback(
    async (status, userId) => {
      try {
        setRemovedCards((prev) => new Set([...prev, userId]));
        setCards((prevCards) => {
          const newCards = prevCards.filter((card) => card._id !== userId);
          return newCards;
        });

        dispatch(removeUserFromFeed(userId));

        await axios.post(
          `${BASE_URL}/request/send/${status}/${userId}`,
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Failed to send request:", err);

        setRemovedCards((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
    },
    [setCards, setRemovedCards, dispatch]
  );

  const handleInterested = useCallback(
    (status, id) => {
      handleSendRequest(status, id);
    },
    [handleSendRequest]
  );

  const handleIgnore = useCallback(
    (status, id) => {
      handleSendRequest(status, id);
    },
    [handleSendRequest]
  );

  const handleDragEnd = useCallback(() => {
    if (isEdit) return;

    const xValue = x.get();

    if (Math.abs(xValue) > 100) {
      if (xValue > 100) {
        handleInterested("interested", _id);
      } else {
        handleIgnore("ignored", _id);
      }
    }
  }, [isEdit, x, _id, handleInterested, handleIgnore]);

  const cardStyle = useMemo(
    () => ({
      gridRow: 1,
      gridColumn: 1,
      x,
      opacity,
      rotate,
      transition: "0.125s transform",
      boxShadow: isFront
        ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.1)"
        : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    }),
    [x, opacity, rotate, isFront]
  );

  const animateProps = useMemo(
    () => ({
      scale: isFront ? 1 : 0.95,
    }),
    [isFront]
  );

  const dragConstraints = useMemo(
    () => (!isEdit ? { left: 0, right: 0 } : undefined),
    [isEdit]
  );

  return (
    <motion.div
      className="absolute w-full max-w-sm h-[600px] sm:h-[650px] origin-bottom rounded-3xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 overflow-hidden shadow-2xl hover:cursor-grab active:cursor-grabbing top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={cardStyle}
      animate={animateProps}
      drag={isFront && !isEdit ? "x" : false}
      dragConstraints={dragConstraints}
      onDragEnd={handleDragEnd}
    >
      {/* Profile Image Section */}
      <div className="relative h-72 sm:h-80 overflow-hidden">
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {firstName} {lastName}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {age}, {gender}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-6 pb-24">
        {/* Skills Section */}
        <div>
          <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-3 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 text-sm font-medium rounded-full hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div>
          <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-3 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            About Me
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
            {about}
          </p>
        </div>
      </div>

      {/* Action Buttons - Only show on front card and when not in edit mode */}
      {isFront && !isEdit && (
        <div className="absolute bottom-6 left-6 right-6 flex justify-center gap-4">
          <button
            onClick={() => handleIgnore("ignored", _id)}
            className="group/btn relative overflow-hidden bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:scale-105 active:scale-95 flex items-center space-x-2"
          >
            <span>Ignored</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
          </button>

          <button
            onClick={() => handleInterested("interested", _id)}
            className="group/btn relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 active:scale-95 flex items-center space-x-2"
          >
            <span>Interested</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
          </button>
        </div>
      )}

      {isFront && !isEdit && (
        <>
          <motion.div
            className="absolute top-16 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-2xl font-bold text-lg shadow-2xl border-2 border-white/20"
            style={{
              rotate: -20,
              opacity: opacityLeft,
            }}
          >
            <div className="flex items-center space-x-2">
              <span>Ignored</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute top-16 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-2xl font-bold text-lg shadow-2xl border-2 border-white/20"
            style={{
              rotate: 20,
              opacity: opacityRight,
            }}
          >
            <div className="flex items-center space-x-2">
              <span>Interested</span>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default SwipeCards;
