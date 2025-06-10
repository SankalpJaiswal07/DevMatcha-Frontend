import SwipeCards from "./SwipeCards";

function UserCard({ user, isEdit }) {
  return (
    <div>
      <SwipeCards user={user} isEdit={isEdit} />
    </div>
  );
}

export default UserCard;
