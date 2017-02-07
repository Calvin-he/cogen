package com.learning.cognitiveenglish.domain;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created by pt on 17-2-6.
 */
@Data
@Entity
public class User extends Auditable {
    @Id
    @GeneratedValue
    private int id;
    private String name;
    private String gender;
    private String realName;
    private String wechatOpenid;

}
