<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">Production_Mes</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="login_name">
                    <el-input v-model="param.login_name" placeholder="login_name">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">Tips : .......</p>
            </el-form>
        </div>
    </div>
</template>

<script>
import request from "../../utils/request";

export default {
    data: function() {
        return {
            param: {
                login_name: 'admin',
                password: 'admin',
            },
            rules: {
                login_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.$axios.post('/api/sysUser/login',this.param).then( res => {
                        console.log(res);
                        if(res.data.code==200)
                        {
                            this.$message.success('登录成功');
                            localStorage.setItem('ms_username', this.param.login_name);
                            localStorage.setItem('userInfo', JSON.stringify(res.data.data));
                            // localStorage.setItem('login_date', res.login_date);
                            // localStorage.setItem('login_ip', res.login_ip);
                            // localStorage.setItem('photo', res.photo);
                            this.$router.push('/');
                        }
                        else
                            this.$message.error('登陆失败');
                    })
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>