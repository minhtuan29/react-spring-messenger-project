package com.mercure.service;

import com.mercure.entity.CallEntity;
import com.mercure.repository.CallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CallService {

    @Autowired
    private CallRepository callRepository;

    public CallEntity save(CallEntity newCall) {
        return callRepository.save(newCall);
    }

    public CallEntity findByGroupUrl(String groupUrl) {
        return callRepository.findLastByUrl(groupUrl);
    }
}
