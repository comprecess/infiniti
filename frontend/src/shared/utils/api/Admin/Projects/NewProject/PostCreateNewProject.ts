import { ProjectsNewProjectForm } from '../../../../../../app/constants/constants'
import { getAuthToken } from '../../../GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const postCreateNewProject = async (
  formData: Partial<ProjectsNewProjectForm>,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_PROJECTS_POST_CREATE_NEW_PROJECT,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ ...formData }),
        },
      )

      const data: Response = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
