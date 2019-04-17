# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_many :enrollments, dependent: :destroy
  has_many :courses, through: :enrollments
  has_many :quiz_submissions, through: :enrollments
  has_many :attendances, through: :enrollments

  def self.search_users(input)
    Course.find_by_sql(["
      SELECT * FROM users
      WHERE ( first_name ILIKE ? OR last_name ILIKE ? )
      ORDER BY first_name, last_name
      ", "#{input}%", "#{input}%"])
  end

  def self.search_users_with_role(input, course_id)
    User.find_by_sql(["
      (
        SELECT
            u.id,
            u.first_name, 
            u.last_name,
            CASE WHEN e.role != '' THEN NULL END AS role
        FROM users AS u
        LEFT JOIN enrollments AS e
        ON e.user_id = u.id
        WHERE ( u.first_name ILIKE ? OR u.last_name ILIKE ? )
        EXCEPT
        SELECT
            u.id,
            u.first_name, 
            u.last_name,
            CASE WHEN e.role != '' THEN NULL END
        FROM users AS u
        LEFT JOIN enrollments AS e
        ON e.user_id = u.id
        WHERE course_id = ?
        AND ( u.first_name ILIKE ? OR u.last_name ILIKE ? )
    )
    UNION
    SELECT 
        u.id,
        u.first_name, 
        u.last_name,
        e.role
    FROM users AS u
    LEFT JOIN enrollments AS e
    ON e.user_id = u.id
    WHERE course_id = ?
    AND ( u.first_name ILIKE ? OR u.last_name ILIKE ? )
    ORDER BY first_name, last_name
    ", "#{input}%", "#{input}%", course_id, "#{input}%", "#{input}%", course_id, "#{input}%", "#{input}%"])
  end

  def self.search_staff_enrolled(input, course_id)
    User.find_by_sql(["
      SELECT u.*, e.role  FROM users AS u
      INNER JOIN enrollments AS e
        ON e.user_id = u.id
      WHERE e.course_id = ?
      AND e.role = 'staff'
      AND ( u.first_name ILIKE ? OR u.last_name ILIKE ? )
      ORDER BY u.first_name
    ", course_id, "#{input}%", "#{input}%" ])
  end

  def self.search_students_enrolled(input, course_id)
    User.find_by_sql(["
      SELECT u.*, e.role  FROM users AS u
      INNER JOIN enrollments AS e
        ON e.user_id = u.id
      WHERE e.course_id = ?
      AND e.role = 'student'
      AND ( u.first_name ILIKE ? OR u.last_name ILIKE ? )
      ORDER BY u.first_name
    ", course_id, "#{input}%", "#{input}%" ])
  end

  def self.get_user_grades(user_id)
    # binding.pry
    User.find_by_sql(["
      SELECT 
        enrollments.id AS enrollment_id, 
        enrollments.course_id, 
        users.id AS user_id, 
        quiz_submissions.points_possible, 
        quiz_submissions.points_awarded, 
        quizzes.title as quiz_title,
        quizzes.due_date as quiz_due_date,
        quizzes.id as quiz_id,
        assignment_submissions.grade,
        assignments.title as assignment_title,
        assignments.due_date as assignment_due_date,
        assignments.id as assignment_id
      FROM enrollments
      INNER JOIN users ON users.id = enrollments.user_id
      LEFT JOIN assignment_submissions ON assignment_submissions.enrollment_id = enrollments.id
      LEFT JOIN quiz_submissions ON quiz_submissions.enrollment_id = enrollments.id
      LEFT JOIN assignments ON assignments.id = assignment_submissions.assignment_id
      LEFT JOIN quizzes ON quizzes.id = quiz_submissions.quiz_id
      WHERE users.id = ?
      ORDER BY quiz_due_date
    ", user_id ])
  end

  def self.calc_total_grades(user_id)
    courses = User.find(user_id).courses
    total_grades = []
    courses.each do |course|
      course_grades = find_by_sql(["
        SELECT enrollments.id AS enrollment_id, enrollments.course_id, users.id AS user_id, quiz_submissions.points_possible, quiz_submissions.points_awarded
        FROM enrollments
        INNER JOIN users ON users.id = enrollments.user_id
        LEFT JOIN assignment_submissions ON assignment_submissions.enrollment_id = enrollments.id
        LEFT JOIN quiz_submissions ON quiz_submissions.enrollment_id = enrollments.id
        WHERE users.id = ? AND course_id = ?
      ", user_id, course.id ])
      
      total_possible = 0
      total_awarded = 0

      course_grades.each do |grade|
        if grade.points_awarded
          total_possible = total_possible + grade.points_possible 
          total_awarded = total_awarded + grade.points_awarded
        end
      end

      if total_possible == 0
        grade_percent = 0;
      else
        # Scale to Percentage and Round to 2 decimal places
        grade_percent = (total_awarded/total_possible * 100).round(0)
      end

      total_grades.push({course_id: course.id, title: course.title, total_awarded: total_awarded, total_possible: total_possible, grade_percent: grade_percent, })
    end

    return total_grades
  end

end
