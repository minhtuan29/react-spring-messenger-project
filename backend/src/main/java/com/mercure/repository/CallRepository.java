package com.mercure.repository;

import com.mercure.entity.CallEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CallRepository extends JpaRepository<CallEntity, Integer> {

    CallEntity findByUrl(String url);

    @Query(value = "SELECT * FROM video WHERE url=:url ORDER BY id DESC LIMIT 1", nativeQuery = true)
    CallEntity findLastByUrl(@Param(value = "url") String url);
}
