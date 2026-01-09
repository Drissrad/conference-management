package ma.enset.discoveryserviced;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServiceDApplication {

    public static void main(String[] args) {
        SpringApplication.run(DiscoveryServiceDApplication.class, args);
    }

}
