import axiosInstance from "../axiosInstance";

export const fetchAllSchedules = async () => {
  const response = await axiosInstance.get("/schedules/all");
  return response.data;
};

export const insertSchedule = async (schedule) => {
  const response = await axiosInstance.post("/schedules/insert-one", schedule);
  return response.data;
};

export const updateSchedule = async (schedule) => {
  const responese = await axiosInstance.patch(
    "/schedules/update-one",
    schedule
  );
  return responese.data;
};
