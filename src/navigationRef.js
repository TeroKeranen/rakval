
import { createNavigationContainerRef } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export const navigate = (name, params) => {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            CommonActions.navigate({
                name,
                params,
            })
        )
    }
}