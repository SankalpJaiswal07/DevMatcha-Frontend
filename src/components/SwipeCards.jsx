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
        console.log("Updating cards - filtered users:", filteredUsers.length);
        setCards(filteredUsers);
      }
    }
  }, [user, removedCards]);

  const emptyState = useMemo(
    () => (
      <div className="flex flex-col items-center justify-center h-50 w-80 bg-base-300 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-2">All done!</h3>
        <p className="text-white text-center px-6">
          You've reviewed all profiles. Check back later for more!
        </p>
      </div>
    ),
    []
  );

  return (
    <div className="flex h-screen w-full justify-center">
      <div className="relative">
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
    console.log("Drag ended with x value:", xValue);

    if (Math.abs(xValue) > 100) {
      if (xValue > 100) {
        console.log("Dragged right - interested");
        handleInterested("interested", _id);
      } else {
        console.log("Dragged left - ignored");
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
      className="absolute h-[630px] w-90 origin-bottom rounded-2xl bg-base-300 overflow-hidden shadow-2xl hover:cursor-grab active:cursor-grabbing -left-48"
      style={cardStyle}
      animate={animateProps}
      drag={isFront && !isEdit ? "x" : false}
      dragConstraints={dragConstraints}
      onDragEnd={handleDragEnd}
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-2xl font-bold text-white mb-1">
            {firstName} {lastName}
          </h2>
          <div className="px-1 py-1">
            <span className="text-sm font-medium">
              {age}, {gender}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 pb-20">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-500 text-sm font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibel text-gray-500 uppercase tracking-wide mb-2">
            About
          </h3>
          <p className="text-blue-300 text-sm leading-relaxed line-clamp-3">
            {about}
          </p>
        </div>
      </div>

      {isFront && !isEdit && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-6">
          <button
            onClick={() => handleIgnore("ignored", _id)}
            className="px-6 py-3 rounded-full text-red-600 border border-red-300 bg-white shadow-md hover:bg-red-50 hover:border-red-400 font-semibold transition-all duration-200 cursor-pointer"
          >
            Ignore
          </button>
          <button
            onClick={() => handleInterested("interested", _id)}
            className="px-6 py-3 rounded-full text-green-600 border border-green-300 bg-white shadow-md hover:bg-green-50 hover:border-green-400 font-semibold transition-all duration-200 cursor-pointer"
          >
            Interested
          </button>
        </div>
      )}

      {isFront && !isEdit && (
        <>
          <motion.div
            className="absolute top-12 left-4 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg"
            style={{
              rotate: -20,
              opacity: opacityLeft,
            }}
          >
            IGNORE
          </motion.div>
          <motion.div
            className="absolute top-12 right-4 transform -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg"
            style={{
              rotate: 20,
              opacity: opacityRight,
            }}
          >
            INTERESTED
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default SwipeCards;
