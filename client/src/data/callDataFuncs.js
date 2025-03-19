import reviews from './reviews';
import profiles from './profiles';
import users from './users';
import tasks from './tasks';
import applications from './applications';

export const getUserData = (id) => {   
   let user = users.filter(el => el.id == id)[0]
   user.profile = getProfileById(id)[0]
   user.profile.avgRating = getUserReviewAvg(id)
   user.profile.numReviews = getUserReviewCount(id)
   return user
}
export const getApplicantsByTask = (id) => applications.filter(el => el.task_id == id)

const getUserReviewCount = (id) => getUserReviews_For(id).length

const getUserReviewAvg = (id) => {
   let userReviews = getUserReviews_For(id)
   let sum = 0
   userReviews.forEach(el => sum += el.rating)
   return sum / userReviews.length
}

export const getUserReviews_By = (id) => reviews.filter(el => el.reviewer == id)

export const getUserReviews_For = (id) => reviews.filter(el => el.reviewee == id)

const getProfileById = (id) => profiles.filter(el => el.userId == id)

export const getUserTasksByPosterId = (id) => tasks.filter(el => el.creator == id)



// others to write? getTasksByApplicantId, getApplicantsByPostId