import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { denormalize } from 'normalizr'
import _get from 'lodash/get'
import _debounce from 'lodash/debounce'
import { logoutUser,
         saveChallenge, unsaveChallenge,
         saveTask, unsaveTask,
         updateUserSettings,
         updateUserAppSetting,
         fetchTopChallenges,
         resetAPIKey,
         userDenormalizationSchema } from '../../../services/User/User'
import AsEndUser from '../../../interactions/User/AsEndUser'

const APP_ID = "mr3Frontend"

/**
 * WithCurrentUser passes down the current user from the redux store.  If the
 * user is non-null, it also automatically adds isSignedIn and isSuperUser
 * fields to the user object (isSignedIn should be checked as the user could be
 * a guest user). Various functions are also made available for managing saved
 * user challenges and tasks, as well as logging out the user.
 *
 * @author [Neil Rotstan](https://github.com/nrotstan)
 */
const WithCurrentUser =
  WrappedComponent => connect(mapStateToProps, mapDispatchToProps)(WrappedComponent)

export const mapStateToProps = state => {
  const props = {user: null}

  const userId = _get(state, 'currentUser.userId')
  const userEntity = _get(state, `entities.users.${userId}`)
  if (userEntity) {
    props.user =
      denormalize(userEntity, userDenormalizationSchema(), state.entities)

    if (props.user) {
      const endUser = AsEndUser(props.user)
      props.user.isLoggedIn = endUser.isLoggedIn()
      props.user.isSuperUser = endUser.isSuperUser()
    }
  }

  return props
}

export const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators({
    logoutUser,
    saveChallenge,
    unsaveChallenge,
    saveTask,
    unsaveTask,
    updateUserSettings,
    fetchTopChallenges,
    resetAPIKey,
  }, dispatch)

  actions.updateUserAppSetting = _debounce((userId, setting) => {
    return dispatch(updateUserAppSetting(userId, APP_ID, setting))
  }, 100)

  actions.getUserAppSetting = (user, settingName) => {
    return _get(user, `properties.${APP_ID}.settings.${settingName}`)
  }

  return actions
}

export default WithCurrentUser
