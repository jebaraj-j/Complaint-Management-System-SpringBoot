package com.jebaraj.cms.service;

import com.jebaraj.cms.entity.Student;
import com.jebaraj.cms.repository.StudentRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {
    private final StudentRepository studentRepository;

    public CustomUserDetailService (StudentRepository studentRepository){

        this.studentRepository = studentRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Student not found with email: " + email
                        )
                );

        return User.builder()
                .username(student.getEmail())
                .password(student.getPassword())
                .roles("STUDENT")
                .build();
    }
}
