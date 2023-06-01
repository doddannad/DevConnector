import React from "react";
import { Link } from "react-router-dom";

const ProfilesPage = () => {
  return (
    <>
      <h1 class="large text-primary">Developers</h1>
      <p class="lead">
        <i class="fab fa-connectdevelop"></i> Browse and connect with developers
      </p>
      <div class="profiles">
        <div class="profile bg-light">
          <img
            class="round-img"
            src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
            alt=""
          />
          <div>
            <h2>John Doe</h2>
            <p>Developer at Microsoft</p>
            <p>Seattle, WA</p>
            <Link to="/profile" class="btn btn-primary">
              View Profile
            </Link>
          </div>

          <ul>
            <li class="text-primary">
              <i class="fas fa-check"></i> HTML
            </li>
            <li class="text-primary">
              <i class="fas fa-check"></i> CSS
            </li>
            <li class="text-primary">
              <i class="fas fa-check"></i> JavaScript
            </li>
            <li class="text-primary">
              <i class="fas fa-check"></i> Python
            </li>
            <li class="text-primary">
              <i class="fas fa-check"></i> C#
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfilesPage;
