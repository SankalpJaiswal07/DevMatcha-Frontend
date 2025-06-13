import SwipeCards from "./SwipeCards";

function UserCard({ user, isEdit }) {
  return (
    <div className="w-full h-full">
      <SwipeCards user={user} isEdit={isEdit} />
    </div>
  );
}

export default UserCard;
