import { useEffect } from "react";

const useEnvironmentChecker = () => {
	useEffect(() => {
		if (process.env.NODE_ENV === "development") {
			if (process.env.REACT_APP_NODE_ENV === "development") {
				console.log("This is the development environment");
			} else if (process.env.REACT_APP_NODE_ENV === "production") {
				console.log("This is the staging environment");
			}
		} else if (process.env.NODE_ENV === "development") {
			console.log("This is the production environment");
		}
	}, []);
};

export default useEnvironmentChecker;
