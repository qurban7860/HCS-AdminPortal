export const getWeekRange = (date) => {
    const givenDate = new Date(date);
    const dayOfWeek = givenDate.getDay();

    const startOfWeek = new Date(givenDate);
    startOfWeek.setDate(givenDate.getDate() - dayOfWeek);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      startOfWeek,
      endOfWeek
    };
  };