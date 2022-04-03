export const getOverview = (_req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
};

export const getTour = (_req, res) => {
  res.status(200).render('tour', {
    title: 'The Snow Explorerer',
  });
};
