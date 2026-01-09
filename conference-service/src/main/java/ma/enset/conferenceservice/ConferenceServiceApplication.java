package ma.enset.conferenceservice;

import ma.enset.conferenceservice.entities.Conference;
import ma.enset.conferenceservice.entities.Review;
import ma.enset.conferenceservice.enums.ConferenceType;
import ma.enset.conferenceservice.repositories.ConferenceRepository;
import ma.enset.conferenceservice.repositories.ReviewRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
public class ConferenceServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConferenceServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner start(ConferenceRepository conferenceRepository, ReviewRepository reviewRepository) {
        return args -> {
            // Create sample conferences
            Conference conf1 = Conference.builder()
                    .titre("Spring Boot Microservices")
                    .type(ConferenceType.ACADEMIQUE)
                    .date(LocalDate.of(2026, 3, 15))
                    .duree(120)
                    .nombreInscrits(150)
                    .score(4.5)
                    .keynoteId(1L)
                    .build();

            Conference conf2 = Conference.builder()
                    .titre("Cloud Native Architecture")
                    .type(ConferenceType.COMMERCIALE)
                    .date(LocalDate.of(2026, 4, 20))
                    .duree(90)
                    .nombreInscrits(200)
                    .score(4.8)
                    .keynoteId(2L)
                    .build();

            Conference conf3 = Conference.builder()
                    .titre("DevOps Best Practices")
                    .type(ConferenceType.ACADEMIQUE)
                    .date(LocalDate.of(2026, 5, 10))
                    .duree(180)
                    .nombreInscrits(100)
                    .score(4.2)
                    .keynoteId(1L)
                    .build();

            conferenceRepository.saveAll(List.of(conf1, conf2, conf3));

            // Create sample reviews
            Review review1 = Review.builder()
                    .date(LocalDate.of(2026, 3, 16))
                    .texte("Excellent conference! Very informative.")
                    .note(5)
                    .conference(conf1)
                    .build();

            Review review2 = Review.builder()
                    .date(LocalDate.of(2026, 3, 16))
                    .texte("Good content but could be more interactive.")
                    .note(4)
                    .conference(conf1)
                    .build();

            Review review3 = Review.builder()
                    .date(LocalDate.of(2026, 4, 21))
                    .texte("Amazing insights on cloud architecture!")
                    .note(5)
                    .conference(conf2)
                    .build();

            reviewRepository.saveAll(List.of(review1, review2, review3));

            System.out.println("=== Sample data loaded ===");
            conferenceRepository.findAll().forEach(c -> {
                System.out.println("Conference: " + c.getTitre() + " - Type: " + c.getType());
            });
        };
    }
}

