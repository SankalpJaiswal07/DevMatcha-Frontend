import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";

const SwipeCards = ({ user, isEdit = false }) => {
  const [cards, setCards] = useState(user);

  useEffect(() => {
    setCards(user); // Sync with updated user data
  }, [user]);
  return (
    <div className="flex h-screen w-full justify-center">
      <div className="relative">
        {cards.map((card, index) => {
          return (
            <Card
              key={card._id}
              {...card}
              id={index}
              cards={cards}
              setCards={setCards}
              isEdit={isEdit}
            />
          );
        })}
        {cards.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 w-80 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              All done!
            </h3>
            <p className="text-gray-600 text-center px-6">
              You've reviewed all profiles. Check back later for more!
            </p>
          </div>
        )}
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
  cards,
  isEdit,
}) => {
  const x = useMotionValue(0);
  console.log(x.get());

  const isFront = _id === cards[cards.length - 1]._id;
  const dispatch = useDispatch();

  // Set offset outside of hook to avoid conditional hook calls
  const offset = isFront ? 0 : id % 2 ? 3 : -3;

  const rotateRaw = useTransform(x, [-150, 150], [-12, 12]);
  const rotate = useTransform(rotateRaw, (value) => `${value + offset}deg`);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const opacityLeft = useTransform(x, [0, -100], [0, 1]);
  const opacityRight = useTransform(x, [0, 100], [0, 1]);

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      // status === "interested" ? removeCard(true) : removeCard(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleInterested = (status, id) => handleSendRequest(status, id);

  const handleIgnore = (status, id) => {
    handleSendRequest(status, id);
  };

  const handleDragEnd = () => {
    if (isEdit) return;
    const xValue = x.get();

    if (Math.abs(xValue) > 100) {
      if (xValue > 100) handleInterested("interested", _id);
      else handleIgnore("ignored", _id);
      setCards((pv) => pv.filter((v) => v._id !== _id));
    }
  };

  return (
    <motion.div
      className="absolute h-[630px] w-90 origin-bottom rounded-2xl bg-base-300 overflow-hidden shadow-2xl hover:cursor-grab active:cursor-grabbing -left-48"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: "0.125s transform",
        boxShadow: isFront
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.1)"
          : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      animate={{
        scale: isFront ? 1 : 0.95,
      }}
      drag={isFront && !isEdit ? "x" : false}
      dragConstraints={!isEdit ? { left: 0, right: 0 } : ""}
      onDragEnd={handleDragEnd}
    >
      {/* Photo Section */}
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
          <div className=" px-1 py-1">
            <span className="text-sm font-medium ">
              {age}, {gender}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4 pb-20">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
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
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
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
            onClick={() => handleIgnore("ignore", _id)}
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

      {/* Swipe Indicators */}
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
