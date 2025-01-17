import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ProductInfo} from '../models/ProductInfo';
import {apiUrl} from '../../environments/environment';
import { UserComment } from '../models/UserComment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private productUrl = `${apiUrl}/product`;
    private commentUrl = `${apiUrl}/comment`;

    constructor(private http: HttpClient) {
    }

    getAllInPage(page: number, size: number): Observable<any> {
        const url = `${this.productUrl}?page=${page}&size=${size}`;
        return this.http.get(url);
            // .pipe(
            //     // tap(_ => console.log(_)),
            // )
    }

    getFiteredInPage(filtered: string): Observable<any> {
        const url = `${this.productUrl}/${filtered}`;
        return this.http.get(url);
    }

    getCategoryInPage(categoryType: number, page: number, size: number): Observable<any> {
        // const url = `${this.productUrl}/by-category/${categoryType}?page=${page}&size=${size}`;
        const url = `${this.productUrl}/by-category/${categoryType}`;
        return this.http.get(url).pipe(
            // tap(data => console.log(data))
        );
    }

    getDetail(id: String): Observable<any> {
        const url = `${this.productUrl}/${id}`;
        return this.http.get<any>(url).pipe(
            catchError(_ => {
                console.log('Get Detail Failed');
                return of(new ProductInfo());
            })
        );
    }

    update(productInfo: ProductInfo): Observable<ProductInfo> {
        const url = `${apiUrl}/seller/product/${productInfo.id}/edit`;
        return this.http.put<ProductInfo>(url, productInfo);
    }

    create(productInfo: ProductInfo): Observable<ProductInfo> {
        const url = `${apiUrl}/seller/product/new`;
        return this.http.post<ProductInfo>(url, productInfo);
    }


    delelte(productInfo: ProductInfo): Observable<any> {
        const url = `${apiUrl}/seller/product/${productInfo.id}/delete`;
        return this.http.delete(url);
    }


    addComment(userComment: UserComment){
        const url = `${this.commentUrl}/add`;
        return this.http.post<any>(url, userComment);
    }

    addResponseComment(commentId: number, comment: string){
        const url = `${this.commentUrl}/response-it`;
        return this.http.post<any>(url, {
            commentId: commentId, 
            comment: comment
        });
    }




    listComment(productId: number, rate?: number): Observable<any> {
        const rateUrl = rate ? `/${rate}` : ``; 
        const url = `${this.commentUrl}/${productId}${rateUrl}`;
        return this.http.get<any>(url);
    }

    listCommentRate(productId: number, rate: number): Observable<any> {
        const url = `${this.commentUrl}/${productId}/${rate}`;
        return this.http.get<any>(url);
    }


    loveComment(userComment: UserComment){
        
        const url = `${this.commentUrl}/love/${userComment.id}`;
        console.log("dsadas " + url);
        return this.http.post<any>(url, userComment);
    }

    hateComment(userComment: UserComment){
        const url = `${this.commentUrl}/hate/${userComment.id}`;
        return this.http.post<any>(url, userComment);
    }




    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
