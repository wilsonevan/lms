class ApplicationController < ActionController::API
  require 'tinify'
  before_action :authenticate_user!, if: proc { request.controller_class.parent == Api }
  include DeviseTokenAuth::Concerns::SetUserByToken

  before_action :configure_permitted_parameters, if: :devise_controller?


  

  protected

  def authorize_admin
    if !current_user.admin
      render json: 'Unauthorized!', status: 401
    end
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :admin ])
  end
end