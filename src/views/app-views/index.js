import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from "components/shared-components/Loading";
import { APP_PREFIX_PATH } from "configs/AppConfig";

export const AppViews = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Switch>
        <Route
          path={`${APP_PREFIX_PATH}/home`}
          component={lazy(() => import(`./home`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/user`}
          component={lazy(() =>
            import(`views/app-views/user/pages/UserManagement`)
          )}
        />
        <Route
          path={`${APP_PREFIX_PATH}/mentor`}
          component={lazy(() =>
            import(`views/app-views/user/pages/MentorManagement`)
          )}
        />
        <Route
          path={`${APP_PREFIX_PATH}/question`}
          component={lazy(() =>
            import(`views/app-views/question/pages/QuestionManagement`)
          )}
        />
        <Route
          path={`${APP_PREFIX_PATH}/question-category`}
          component={lazy(() =>
            import(`views/app-views/question-category/pages/QuestionCategory`)
          )}
        />
        <Route
          path={`${APP_PREFIX_PATH}/feedback`}
          component={lazy(() =>
            import(`views/app-views/feedback/pages/FeedbackManagement`)
          )}
        />
        <Route
          path={`${APP_PREFIX_PATH}/feedback_notify`}
          component={lazy(() =>
            import(`views/app-views/pageSendEmail/sendEmail`)
          )}
        />
        <Route
          path={`${APP_PREFIX_PATH}/education`}
          component={lazy(() =>
            import(`views/app-views/education/pages/EducationManagement`)
          )}
        />
        <Redirect from={`${APP_PREFIX_PATH}`} to={`${APP_PREFIX_PATH}/home`} />
      </Switch>
    </Suspense>
  );
};

export default React.memo(AppViews);
