import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import { history } from "../..";
import agent, { apiUrl } from "../api/agent";
import { formatToLocalPH } from "../common/util/util";
import { IWagererTransaction } from "../models/profile";
import { IPredictionNotification, IUser, IUserFormValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class UserStore {

    rootStore: RootStore;
    @observable user: IUser | null = null;
    @observable loading = false;
    @observable userLoading = true;

    @observable.ref hubConnection: HubConnection | null = null;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        makeObservable(this);

        reaction(
            () => this.user,
            (user) => {
                if (user) {
                    window.localStorage.setItem("jwt", user.token)
                    this.createHubConnection(this.user!.token);
                    this.rootStore.profileStore.reset();
                } else {
                    window.localStorage.removeItem("jwt");
                    this.stopHubConnection();
                }
            }
        )
    }

    @computed get isLoggedIn() {
        return !!this.user;
    }

    initializeUser = (user: IUser) => {
        if (user.predictionNotifications) {
            user.predictionNotifications.forEach(x => x.when = new Date(x.when));
            user.predictionNotifications = user.predictionNotifications.sort((a, b) => {
                return b.when.getTime() - a.when.getTime()
            })
        }
        return user;
    }

    @action createHubConnection = (token: string) => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(apiUrl + '/mainhub', {
                accessTokenFactory: () => token
            })
            .configureLogging(LogLevel.None)
            .build();

        this.hubConnection.start()
            .catch(error => console.log('Error establishing connection', error));

        this.hubConnection.on('ReceiveDeposit', (despositData: IWagererTransaction) => {
            runInAction(() => {
                this.user!.walletBalance += despositData.amount;
                despositData.when = new Date(despositData.when);
                this.rootStore.profileStore.transactionRegistry.set(despositData.id, despositData);
                toast.success('You have received ' + formatToLocalPH(despositData.amount));
            });
        });

        this.hubConnection.on('ReceivePredictionOutome', (notif: IPredictionNotification) => {
            runInAction(() => {
                this.user!.predictionNotifications = [notif, ...this.user!.predictionNotifications]

                if (notif.outcome > 0) {
                    this.user!.walletBalance += notif.outcome;
                    toast.info('You have won a prediction')
                }
                else
                    toast.info('You have lost a prediction')
            })
        })

        this.hubConnection.on("Banned", () => {
            toast.warning("You got banned!");
            this.logout();
        });
    }

    @action stopHubConnection = () => {
        this.hubConnection!.stop();
    }


    @action register = async (formValues: IUserFormValues) => {
        this.loading = true;
        try {
            const user = await agent.User.register(formValues);
            this.rootStore.modalStore.closeModal();
            runInAction(() => {
                this.user = user;
            })
            toast.success("Registration Successful!")
        } catch (error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action login = async (formValues: IUserFormValues) => {
        this.loading = true;
        try {
            let user = await agent.User.login(formValues);
            toast.success("Login Successful!");
            this.rootStore.modalStore.closeModal();
            user = this.initializeUser(user);
            runInAction(() => {
                this.user = user;
            })
            history.push('/matches');
        } catch (error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action getUser = async () => {
        this.userLoading = true;
        try {
            if (window.localStorage.getItem("jwt")) {
                let user = await agent.User.current();
                user = this.initializeUser(user);
                runInAction(() => {
                    this.user = user;
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.userLoading = false;
            })
        }
    }

    @action logout = () => {
        this.user = null;
        
        toast.info("You are now logged out");
    }

    @action readPredictionNotification = (id: number) => {
        this.user!.predictionNotifications = this.user!.predictionNotifications.filter(x => x.id !== id);
        this.rootStore.predictionStore
            .readNotification(id);
    }
}