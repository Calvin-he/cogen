package com.learning.cognitiveenglish.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created by pt on 17-2-6.
 */
@Data
@Entity
public class User extends Auditable{
    @Id
    @GeneratedValue
    private int id;
    private String name;
    private String gender;
    @JsonProperty("real_name")
    private String realName;
    @JsonProperty("wechat_openid")
    private String wecharOpenid;
}
