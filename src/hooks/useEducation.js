import { useCallback, useEffect, useState } from "react";
import EducationService from "../services/EducationService";
import { EDUCATIONS } from "../constants/consts";
import { useAccount } from "./useAccount";

export default function useEducation() {
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const { isLoggedIn } = useAccount();

  const schoolsStorage = localStorage.getItem(EDUCATIONS) || null;

  const loadSchools = useCallback(() => {
    if (isLoggedIn) {
      setLoading(true);
      EducationService.getAll().then((res) => {
        if (res.statusCode && res.data) {
          const filterData = res.data.filter((item) => !item.is_deleted);
          setSchools(filterData);
          localStorage.setItem(EDUCATIONS, JSON.stringify(filterData));
        }
        setLoading(false);
      });
    }
  }, [isLoggedIn]);
  
  useEffect(() => {
    if (schoolsStorage) {
      setSchools(JSON.parse(schoolsStorage));
    } else {
      loadSchools();
    }
  }, [isLoggedIn, schoolsStorage]);

  return { schools, loading, loadSchools };
}
