Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'api/auth'

  namespace :api do

    resources :enrollments, only: [:create, :update, :destroy]

    resources :courses do
      resources :sections
    end
  
    resources :sections, only: [] do
      resources :units
    end
  
    resources :units, only: [] do
      resources :contents
    end
  end
end