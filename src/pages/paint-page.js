import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../components/page-layout";
import { PaintHeader } from "../components/paint/PaintHeader";
import PaintBody from "../components/paint/PaintBody";

const PaintPage = () => {
  const { user } = useAuth0();

  if (!user) {
    return null;
  }
  return (
    <PageLayout>
      <div className="content-layout">
        <div>
          <PaintHeader />
          <PaintBody />
        </div>
      </div>
    </PageLayout>
  );
};

export default PaintPage;
