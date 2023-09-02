import React, { useEffect, useState } from "react";

import "./profile.scss";
import AchievementCard from "./AchievementCard";
import { useGlobalSelector } from "../redux/hooks";
import { DataBase } from "../firebase/database";
import { where } from "firebase/firestore";
import Loading from "../Loading/Loading";

const achievementsDataBase = new DataBase({ path: "achievements" });

export type TAchievement = {
  background: string;
  backgroundImage: string;
  currentProgress: number;
  description: string;
  id: string;
  query: string;
  title: string;
  totalProgress: number;
  userId: string;
};

const Profile = () => {
  const [achievements, setAchievements] = useState<TAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useGlobalSelector((state) => {
    return state.auth.getCurrentUser;
  });

  useEffect(() => {
    achievementsDataBase.listData((data) => {
      setAchievements(
        data.map((achievement) => {
          const _achievement = achievement.data() as TAchievement;

          return _achievement;
        })
      );
      setLoading(false)
    }, where("userId", "==", user?.uid));
  }, [user]);

  return (
    <div id="profile-page">
      {
        loading ? <Loading positionAbsolute message="Carregando, aguarde." /> : (<>
          <div id="user-profile">
          <div
            id="avatar"
            style={{
              backgroundImage: `url('${user?.photoURL}')`,
            }}></div>
          <div id="info">
            <p className="heading-2">{user?.displayName}</p>
            <span>9º ano</span>
          </div>
        </div>
        <div id="achievements">
          <h2 className="subsection-title subheading-semi">Suas conquistas</h2>
          <div>
            {achievements.map((achievement, i) => (
              <AchievementCard key={i} achievement={achievement} />
            ))}
          </div>
        </div></>
        )
      }

    </div>
  );
};

export default Profile;
